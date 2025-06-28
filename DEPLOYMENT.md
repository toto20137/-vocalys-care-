# Guide de Déploiement - Vocalys Care

## 🚀 Déploiement Frontend (Vercel/Netlify)

### Option 1: Vercel (Recommandé)

1. **Préparer le build**
   ```bash
   npm run build:web
   ```

2. **Déployer sur Vercel**
   - Connecter votre repository GitHub à Vercel
   - Configurer les variables d'environnement :
     - `EXPO_PUBLIC_SUPABASE_URL`
     - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
     - `EXPO_PUBLIC_SERVER_URL` (URL de votre backend déployé)

3. **Configuration automatique**
   - Vercel détectera automatiquement le fichier `vercel.json`
   - Le build se fera automatiquement

### Option 2: Netlify

1. **Build local**
   ```bash
   npm run build:web
   ```

2. **Déployer sur Netlify**
   - Glisser-déposer le dossier `dist` sur Netlify
   - Ou connecter votre repository GitHub
   - Configurer les variables d'environnement dans les settings Netlify

## 🖥️ Déploiement Backend (Railway/Render)

### Option 1: Railway (Recommandé)

1. **Créer un nouveau projet sur Railway**
   - Connecter votre repository GitHub
   - Railway détectera automatiquement Node.js

2. **Configurer les variables d'environnement**
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ELEVENLABS_AGENT_ID=your_agent_id
   PORT=3001
   ```

3. **Configurer le start command**
   ```
   npm run server
   ```

### Option 2: Render

1. **Créer un nouveau Web Service**
   - Connecter votre repository
   - Build Command: `npm install`
   - Start Command: `npm run server`

2. **Configurer les variables d'environnement** (même que Railway)

## 📱 Déploiement Mobile (Expo)

### Build de développement
```bash
npx expo install --fix
npx expo run:ios
npx expo run:android
```

### Build de production
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Les deux
eas build --platform all
```

## 🗄️ Configuration Supabase

### 1. Créer le projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et les clés API

### 2. Exécuter les migrations
1. Aller dans l'éditeur SQL de Supabase
2. Copier le contenu de `supabase/migrations/20250628172500_green_valley.sql`
3. Exécuter le script

### 3. Configurer l'authentification
1. Aller dans Authentication > Settings
2. Désactiver "Confirm email" si nécessaire
3. Configurer les redirections pour votre domaine

## 🤖 Configuration ElevenLabs

### 1. Créer un agent conversationnel
1. Aller sur [elevenlabs.io](https://elevenlabs.io)
2. Créer un nouvel agent dans "Conversational AI"
3. Configurer la personnalité :

```
Tu es un assistant IA bienveillant qui appelle des seniors pour prendre de leurs nouvelles. 
Sois chaleureux, patient et à l'écoute. Pose des questions sur leur bien-être, leur humeur, 
leurs activités récentes et leur santé. Détecte les signaux de détresse ou d'isolement. 
Garde un ton conversationnel naturel et évite d'être trop formel.
```

### 2. Configurer les webhooks
- **Webhook URL** : `https://your-backend-url.com/api/webhook`
- **Events** : `conversation.ended`

## 🔧 Variables d'environnement complètes

### Frontend (.env)
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_SERVER_URL=https://your-backend-url.com
```

### Backend
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id
PORT=3001
```

## ✅ Checklist de déploiement

- [ ] Supabase configuré et migrations exécutées
- [ ] ElevenLabs agent créé et configuré
- [ ] Variables d'environnement configurées
- [ ] Backend déployé et fonctionnel
- [ ] Frontend déployé et connecté au backend
- [ ] Webhooks ElevenLabs configurés
- [ ] Tests de bout en bout effectués

## 🔍 Vérification du déploiement

1. **Tester l'authentification**
   - Créer un compte
   - Se connecter/déconnecter

2. **Tester la gestion des bénéficiaires**
   - Ajouter un bénéficiaire
   - Modifier les informations

3. **Tester les appels** (avec un vrai numéro de test)
   - Lancer un appel IA
   - Vérifier la réception du webhook
   - Consulter le résumé

4. **Vérifier les statistiques**
   - Dashboard avec données réelles
   - Alertes fonctionnelles

## 🆘 Dépannage

### Erreurs communes

1. **CORS Error**
   - Vérifier la configuration CORS dans le backend
   - Ajouter votre domaine frontend aux origines autorisées

2. **Supabase RLS**
   - Vérifier que les politiques RLS sont correctes
   - Tester avec un utilisateur authentifié

3. **ElevenLabs Webhook**
   - Vérifier que l'URL webhook est accessible publiquement
   - Tester avec ngrok en développement

4. **Variables d'environnement**
   - Vérifier que toutes les variables sont définies
   - Redémarrer les services après modification

## 📞 Support

En cas de problème, vérifier :
1. Les logs du backend
2. Les logs de Supabase
3. Les logs d'ElevenLabs
4. La console du navigateur pour le frontend