# Vocalys Care - Application d'Appels IA pour Seniors

Une application complète qui utilise l'intelligence artificielle d'ElevenLabs pour maintenir le lien social avec les seniors grâce à des appels automatisés bienveillants.

## 🚀 Fonctionnalités

### 🤖 Appels IA Automatisés
- Intégration avec ElevenLabs Conversational AI
- Appels automatiques programmés
- Conversations naturelles et empathiques
- Détection automatique de l'humeur et des préoccupations

### 📊 Tableau de Bord Intelligent
- Statistiques en temps réel
- Résumés détaillés des conversations
- Alertes automatiques en cas de problème
- Historique complet des appels

### 👥 Gestion des Bénéficiaires
- Ajout et gestion des proches
- Configuration des horaires d'appels
- Contacts d'urgence
- Profils personnalisés

### 🔔 Système d'Alertes
- Détection automatique des signaux de détresse
- Notifications en temps réel
- Niveaux d'alerte configurables
- Rapports détaillés

## 🛠️ Technologies Utilisées

### Frontend
- **React Native** avec Expo Router
- **TypeScript** pour la sécurité des types
- **Supabase** pour la base de données
- **Lucide React Native** pour les icônes

### Backend
- **Node.js** avec Express
- **ElevenLabs API** pour les appels IA
- **Supabase** pour la persistance des données
- **Webhooks** pour les notifications en temps réel

### Base de Données
- **PostgreSQL** via Supabase
- **Row Level Security (RLS)** pour la sécurité
- **Migrations** automatisées

## 📋 Prérequis

1. **Compte ElevenLabs**
   - Créer un compte sur [ElevenLabs](https://elevenlabs.io)
   - Obtenir une clé API
   - Configurer un agent conversationnel

2. **Compte Supabase**
   - Créer un projet sur [Supabase](https://supabase.com)
   - Obtenir l'URL et la clé anonyme

3. **Node.js** (version 18 ou supérieure)

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd vocalys-care
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
Copier le fichier `.env.example` vers `.env` et remplir les valeurs :

```bash
cp .env.example .env
```

Éditer le fichier `.env` :
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id

# Server Configuration
SERVER_URL=http://localhost:3001
PORT=3001
```

### 4. Configuration de la base de données
Exécuter les migrations Supabase :
```sql
-- Copier le contenu de supabase/migrations/001_initial_schema.sql
-- et l'exécuter dans l'éditeur SQL de Supabase
```

### 5. Démarrer le serveur backend
```bash
npm run server
```

### 6. Démarrer l'application
```bash
npm run dev
```

## 🔧 Configuration ElevenLabs

### 1. Créer un Agent Conversationnel
1. Aller dans la section "Conversational AI" d'ElevenLabs
2. Créer un nouvel agent
3. Configurer la personnalité pour être bienveillante et empathique
4. Noter l'ID de l'agent

### 2. Configurer les Webhooks
Dans les paramètres de votre agent ElevenLabs :
- **Webhook URL** : `https://your-domain.com/api/webhook`
- **Events** : `conversation.ended`

### 3. Prompt Système Recommandé
```
Tu es un assistant IA bienveillant qui appelle des seniors pour prendre de leurs nouvelles. 
Sois chaleureux, patient et à l'écoute. Pose des questions sur leur bien-être, leur humeur, 
leurs activités récentes et leur santé. Détecte les signaux de détresse ou d'isolement. 
Garde un ton conversationnel naturel et évite d'être trop formel.
```

## 📱 Utilisation

### 1. Créer un Compte
- Ouvrir l'application
- S'inscrire avec un email et mot de passe
- Choisir le type de compte (Famille ou Collectivité)

### 2. Ajouter des Bénéficiaires
- Aller dans l'onglet "Mes Proches"
- Cliquer sur "+" pour ajouter un proche
- Remplir les informations (nom, téléphone, adresse)

### 3. Lancer un Appel
- Sélectionner un bénéficiaire
- Cliquer sur "Appeler maintenant"
- L'IA appellera automatiquement

### 4. Consulter les Résumés
- Les résumés apparaissent dans le tableau de bord
- Consulter les détails, l'humeur détectée et les alertes

## 🔒 Sécurité

- **Chiffrement** : Toutes les données sont chiffrées
- **RGPD** : Conformité complète
- **RLS** : Sécurité au niveau des lignes
- **Authentification** : Gestion sécurisée des utilisateurs

## 📊 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Node.js API   │    │   ElevenLabs    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (AI Calls)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│    Supabase     │    │    Webhooks     │
│   (Database)    │    │  (Real-time)    │
└─────────────────┘    └─────────────────┘
```

## 🚀 Déploiement

### Backend (Railway/Heroku)
1. Créer un compte sur Railway ou Heroku
2. Connecter le repository
3. Configurer les variables d'environnement
4. Déployer

### Frontend (Vercel/Netlify)
1. Build pour le web : `npm run build:web`
2. Déployer le dossier `dist` sur Vercel ou Netlify

## 📞 Support

Pour toute question ou problème :
- Email : support@vocalyscare.fr
- Documentation : [docs.vocalyscare.fr](https://docs.vocalyscare.fr)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir `CONTRIBUTING.md` pour les guidelines.

---

**Vocalys Care** - L'IA qui prend soin de vos proches 💙