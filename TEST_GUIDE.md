# Guide de Test - Vocalys Care

## 🧪 Comment tester l'application

### 1. Mode Développement (Sans ElevenLabs)

L'application fonctionne en mode démo sans configuration ElevenLabs :

```bash
# Démarrer l'application
npm run dev
```

**Fonctionnalités testables :**
- ✅ Authentification (signup/login)
- ✅ Gestion des bénéficiaires
- ✅ Interface utilisateur complète
- ✅ Navigation entre les onglets
- ✅ Données de démonstration

### 2. Test avec Supabase (Recommandé)

#### Étape 1: Configurer Supabase
1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Aller dans Settings > API pour récupérer :
   - Project URL
   - Anon public key

#### Étape 2: Exécuter la migration
1. Aller dans SQL Editor de Supabase
2. Copier le contenu de `supabase/migrations/20250628172500_green_valley.sql`
3. Exécuter le script

#### Étape 3: Configurer les variables
Modifier le fichier `.env` :
```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

#### Étape 4: Tester
```bash
npm run dev
```

**Nouvelles fonctionnalités :**
- ✅ Authentification réelle
- ✅ Sauvegarde des bénéficiaires
- ✅ Données persistantes
- ✅ Sécurité RLS

### 3. Test Complet avec ElevenLabs

#### Prérequis
1. Compte ElevenLabs avec crédits
2. Agent conversationnel configuré
3. Webhook accessible publiquement

#### Configuration
```env
ELEVENLABS_API_KEY=sk-...
ELEVENLABS_AGENT_ID=agent_...
```

#### Test des appels
1. Ajouter un bénéficiaire avec votre numéro
2. Cliquer sur "Appeler maintenant"
3. Recevoir l'appel IA
4. Consulter le résumé généré

## 🚀 Déploiement

### Option 1: Déploiement Simple (Frontend seulement)

```bash
# Build pour le web
npm run build:web

# Déployer sur Netlify/Vercel
# Glisser-déposer le dossier 'dist'
```

### Option 2: Déploiement Complet

#### Backend (Railway)
1. Créer un compte sur [railway.app](https://railway.app)
2. Connecter votre repository GitHub
3. Configurer les variables d'environnement
4. Déployer automatiquement

#### Frontend (Vercel)
1. Connecter à [vercel.com](https://vercel.com)
2. Importer le repository
3. Configurer les variables d'environnement
4. Déployer

## 📱 Test sur Mobile

### Expo Go (Développement)
```bash
npm run dev
# Scanner le QR code avec Expo Go
```

### Build de Production
```bash
# Installer EAS CLI
npm install -g @expo/eas-cli

# Build pour iOS/Android
eas build --platform all
```

## ✅ Checklist de Test

### Tests de Base
- [ ] Application se lance sans erreur
- [ ] Navigation entre onglets fonctionne
- [ ] Interface responsive sur mobile/web
- [ ] Authentification (signup/login)

### Tests avec Supabase
- [ ] Création de compte utilisateur
- [ ] Ajout/modification de bénéficiaires
- [ ] Persistance des données
- [ ] Sécurité (utilisateur ne voit que ses données)

### Tests avec ElevenLabs
- [ ] Lancement d'appel IA
- [ ] Réception de l'appel
- [ ] Génération du résumé
- [ ] Affichage des statistiques

## 🔧 Dépannage

### Erreurs communes

1. **"Supabase URL not found"**
   - Vérifier le fichier `.env`
   - Redémarrer l'application

2. **"Failed to fetch"**
   - Vérifier que le serveur backend tourne
   - Vérifier l'URL dans `.env`

3. **"RLS Policy violation"**
   - Vérifier que les migrations sont exécutées
   - Vérifier l'authentification

### Logs utiles
```bash
# Logs du serveur
npm run server

# Logs Expo
npm run dev

# Console navigateur (F12)
```

## 📞 Numéros de Test

Pour tester les appels ElevenLabs :
- Utilisez votre propre numéro
- Ou un numéro de test ElevenLabs
- Évitez les numéros inconnus

## 🎯 Prochaines Étapes

1. **Tester en mode démo** (5 min)
2. **Configurer Supabase** (15 min)
3. **Tester avec vraie DB** (10 min)
4. **Déployer frontend** (10 min)
5. **Configurer ElevenLabs** (30 min)
6. **Test complet** (15 min)

**Total : ~1h30 pour un déploiement complet**