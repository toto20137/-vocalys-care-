const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ElevenLabs Configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

// Supabase Configuration (for server-side operations)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

// Route pour déclencher un appel
app.post('/api/call', async (req, res) => {
  try {
    const { beneficiaryId, phoneNumber, name } = req.body;

    if (!beneficiaryId || !phoneNumber || !name) {
      return res.status(400).json({ 
        error: 'Missing required fields: beneficiaryId, phoneNumber, name' 
      });
    }

    // Créer un enregistrement d'appel dans Supabase
    const { data: callData, error: callError } = await supabase
      .from('calls')
      .insert({
        beneficiary_id: beneficiaryId,
        status: 'pending',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (callError) {
      console.error('Error creating call record:', callError);
      return res.status(500).json({ error: 'Failed to create call record' });
    }

    // Configuration de l'agent ElevenLabs
    const agentConfig = {
      agent_id: process.env.ELEVENLABS_AGENT_ID,
      customer_phone_number: phoneNumber,
      customer_name: name,
      metadata: {
        call_id: callData.id,
        beneficiary_id: beneficiaryId
      }
    };

    // Déclencher l'appel via ElevenLabs
    const response = await axios.post(
      `${ELEVENLABS_BASE_URL}/convai/conversations`,
      agentConfig,
      {
        headers: {
          'Authorization': `Bearer ${ELEVENLABS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Mettre à jour l'enregistrement avec l'ID de conversation ElevenLabs
    await supabase
      .from('calls')
      .update({
        elevenlabs_conversation_id: response.data.conversation_id,
        status: 'in_progress'
      })
      .eq('id', callData.id);

    res.json({
      success: true,
      callId: callData.id,
      conversationId: response.data.conversation_id,
      message: 'Call initiated successfully'
    });

  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ 
      error: 'Failed to initiate call',
      details: error.response?.data || error.message 
    });
  }
});

// Webhook pour recevoir les résumés d'appels d'ElevenLabs
app.post('/api/webhook', async (req, res) => {
  try {
    const { conversation_id, status, transcript, summary, metadata } = req.body;

    console.log('Received webhook:', { conversation_id, status, metadata });

    // Trouver l'appel correspondant
    const { data: callData, error: callError } = await supabase
      .from('calls')
      .select('*')
      .eq('elevenlabs_conversation_id', conversation_id)
      .single();

    if (callError || !callData) {
      console.error('Call not found:', callError);
      return res.status(404).json({ error: 'Call not found' });
    }

    // Mettre à jour le statut de l'appel
    const updateData = {
      status: status === 'ended' ? 'completed' : 'failed',
      ended_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (status === 'ended') {
      updateData.duration = calculateDuration(callData.started_at, updateData.ended_at);
    }

    await supabase
      .from('calls')
      .update(updateData)
      .eq('id', callData.id);

    // Si nous avons un résumé, créer l'enregistrement de résumé
    if (summary && transcript) {
      const analysisResult = analyzeConversation(transcript, summary);
      
      await supabase
        .from('summaries')
        .insert({
          call_id: callData.id,
          summary: summary,
          mood: analysisResult.mood,
          alert_level: analysisResult.alertLevel,
          keywords: analysisResult.keywords,
          health_mentions: analysisResult.healthMentions,
          concerns: analysisResult.concerns,
          transcript: transcript
        });
    }

    res.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Route pour obtenir l'historique des appels
app.get('/api/calls/:beneficiaryId', async (req, res) => {
  try {
    const { beneficiaryId } = req.params;

    const { data, error } = await supabase
      .from('calls')
      .select(`
        *,
        summaries (*)
      `)
      .eq('beneficiary_id', beneficiaryId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching calls:', error);
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
});

// Route pour obtenir les statistiques
app.get('/api/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Obtenir tous les bénéficiaires de l'utilisateur
    const { data: beneficiaries } = await supabase
      .from('beneficiaries')
      .select('id')
      .eq('user_id', userId);

    if (!beneficiaries || beneficiaries.length === 0) {
      return res.json({
        totalCalls: 0,
        averageDuration: 0,
        responseRate: 0,
        positiveRatio: 0,
        alertsCount: 0
      });
    }

    const beneficiaryIds = beneficiaries.map(b => b.id);

    // Statistiques des appels
    const { data: calls } = await supabase
      .from('calls')
      .select(`
        *,
        summaries (mood, alert_level)
      `)
      .in('beneficiary_id', beneficiaryIds)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const totalCalls = calls?.length || 0;
    const completedCalls = calls?.filter(c => c.status === 'completed') || [];
    const averageDuration = completedCalls.reduce((acc, call) => acc + (call.duration || 0), 0) / completedCalls.length || 0;
    const responseRate = totalCalls > 0 ? (completedCalls.length / totalCalls) * 100 : 0;
    
    const summariesWithMood = calls?.filter(c => c.summaries && c.summaries.length > 0) || [];
    const positiveMoods = summariesWithMood.filter(c => c.summaries[0]?.mood === 'positive').length;
    const positiveRatio = summariesWithMood.length > 0 ? (positiveMoods / summariesWithMood.length) * 100 : 0;
    
    const alertsCount = summariesWithMood.filter(c => 
      c.summaries[0]?.alert_level && c.summaries[0].alert_level !== 'none'
    ).length;

    res.json({
      totalCalls,
      averageDuration: Math.round(averageDuration),
      responseRate: Math.round(responseRate),
      positiveRatio: Math.round(positiveRatio),
      alertsCount
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Fonction utilitaire pour calculer la durée
function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end - start) / 1000); // en secondes
}

// Fonction d'analyse de conversation (IA basique)
function analyzeConversation(transcript, summary) {
  const text = (transcript + ' ' + summary).toLowerCase();
  
  // Analyse de l'humeur
  const positiveWords = ['bien', 'content', 'heureux', 'joie', 'sourire', 'excellent', 'formidable'];
  const negativeWords = ['triste', 'mal', 'douleur', 'problème', 'inquiet', 'fatigue', 'difficile'];
  
  const positiveCount = positiveWords.filter(word => text.includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.includes(word)).length;
  
  let mood = 'neutral';
  if (positiveCount > negativeCount) mood = 'positive';
  else if (negativeCount > positiveCount) mood = 'negative';
  
  // Détection d'alertes
  const alertWords = ['urgence', 'hôpital', 'chute', 'accident', 'aide', 'secours', 'mal'];
  const healthWords = ['médecin', 'médicament', 'douleur', 'santé', 'traitement'];
  
  const alertCount = alertWords.filter(word => text.includes(word)).length;
  const healthCount = healthWords.filter(word => text.includes(word)).length;
  
  let alertLevel = 'none';
  if (alertCount > 2) alertLevel = 'high';
  else if (alertCount > 0 || healthCount > 1) alertLevel = 'medium';
  else if (healthCount > 0) alertLevel = 'low';
  
  // Extraction de mots-clés
  const keywords = [];
  const keywordPatterns = ['famille', 'enfants', 'petits-enfants', 'médecin', 'médicament', 'sortie', 'visite'];
  keywordPatterns.forEach(pattern => {
    if (text.includes(pattern)) keywords.push(pattern);
  });
  
  // Mentions de santé
  const healthMentions = [];
  if (text.includes('douleur')) healthMentions.push('Douleur mentionnée');
  if (text.includes('fatigue')) healthMentions.push('Fatigue signalée');
  if (text.includes('médicament')) healthMentions.push('Médicaments évoqués');
  
  // Préoccupations
  const concerns = [];
  if (alertCount > 0) concerns.push('Signaux d\'alerte détectés');
  if (text.includes('seul') || text.includes('isolé')) concerns.push('Isolement possible');
  if (text.includes('argent') || text.includes('facture')) concerns.push('Préoccupations financières');
  
  return {
    mood,
    alertLevel,
    keywords,
    healthMentions,
    concerns
  };
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/api/webhook`);
});