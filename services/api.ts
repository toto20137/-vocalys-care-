import { supabase } from '@/lib/supabase';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:3001';

export interface CallRequest {
  beneficiaryId: string;
  phoneNumber: string;
  name: string;
}

export interface CallResponse {
  success: boolean;
  callId: string;
  conversationId: string;
  message: string;
}

export interface CallStats {
  totalCalls: number;
  averageDuration: number;
  responseRate: number;
  positiveRatio: number;
  alertsCount: number;
}

export class ApiService {
  // Déclencher un appel
  static async initiateCall(request: CallRequest): Promise<CallResponse> {
    try {
      const response = await fetch(`${SERVER_URL}/api/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error initiating call:', error);
      // En mode développement, simuler une réponse
      if (__DEV__) {
        return {
          success: true,
          callId: 'demo-' + Date.now(),
          conversationId: 'conv-' + Date.now(),
          message: 'Call initiated successfully (demo mode)'
        };
      }
      throw error;
    }
  }

  // Obtenir l'historique des appels
  static async getCallHistory(beneficiaryId: string) {
    try {
      const response = await fetch(`${SERVER_URL}/api/calls/${beneficiaryId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching call history:', error);
      // En mode développement, retourner des données de démonstration
      if (__DEV__) {
        return [];
      }
      throw error;
    }
  }

  // Obtenir les statistiques
  static async getStats(userId: string): Promise<CallStats> {
    try {
      const response = await fetch(`${SERVER_URL}/api/stats/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      // En mode développement, retourner des statistiques de démonstration
      if (__DEV__) {
        return {
          totalCalls: 12,
          averageDuration: 8,
          responseRate: 94,
          positiveRatio: 78,
          alertsCount: 2
        };
      }
      throw error;
    }
  }

  // Gestion des bénéficiaires via Supabase
  static async getBeneficiaries(userId: string) {
    const { data, error } = await supabase
      .from('beneficiaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createBeneficiary(beneficiary: any) {
    const { data, error } = await supabase
      .from('beneficiaries')
      .insert(beneficiary)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBeneficiary(id: string, updates: any) {
    const { data, error } = await supabase
      .from('beneficiaries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteBeneficiary(id: string) {
    const { error } = await supabase
      .from('beneficiaries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Obtenir les résumés d'appels avec alertes
  static async getCallSummaries(userId: string) {
    const { data, error } = await supabase
      .from('summaries')
      .select(`
        *,
        calls!inner (
          *,
          beneficiaries!inner (
            name,
            user_id
          )
        )
      `)
      .eq('calls.beneficiaries.user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching call summaries:', error);
      return [];
    }
    return data || [];
  }

  // Obtenir les alertes actives
  static async getActiveAlerts(userId: string) {
    const { data, error } = await supabase
      .from('summaries')
      .select(`
        *,
        calls!inner (
          *,
          beneficiaries!inner (
            name,
            user_id
          )
        )
      `)
      .eq('calls.beneficiaries.user_id', userId)
      .in('alert_level', ['medium', 'high', 'critical'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active alerts:', error);
      return [];
    }
    return data || [];
  }
}