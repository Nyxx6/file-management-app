# Guide d'installation - Application SONATRACH

## Prérequis
- Node.js 18+
- MySQL 8.0+
- npm ou yarn

## Étapes d'installation

### 1. Créer la base de données MySQL
\`\`\`bash
mysql -u root -p < scripts/01-schema.sql
\`\`\`

### 2. Installer les dépendances
\`\`\`bash
npm install
\`\`\`

### 3. Configurer les variables d'environnement
Créer un fichier `.env.local` avec:
\`\`\`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=sonatrach_files
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
SESSION_SECRET=your_session_secret_key_here_change_in_production
\`\`\`

### 4. Lancer l'application
\`\`\`bash
npm run dev
\`\`\`

L'application sera disponible sur http://localhost:3000

## Identifiants de test
- **Admin:** admin@sonatrach.com / admin123
- **Secrétaire:** secretaire@sonatrach.com / sec123
- **Utilisateur:** user@sonatrach.com / user123

## Fonctionnalités principales

### Pour tous les utilisateurs
- Authentification avec email et mot de passe
- Authentification à deux facteurs (2FA)
- Upload et gestion de fichiers personnels
- Téléchargement de fichiers
- Signalement de fichiers suspects

### Pour les secrétaires
- Gestion complète des fichiers
- Gestion des utilisateurs (création, modification, suppression)
- Gestion des permissions d'accès
- Partage de fichiers

### Pour les administrateurs
- Accès à toutes les fonctionnalités
- Tableau de bord avec statistiques
- Gestion des signalements
- Gestion complète des utilisateurs et rôles
- Historique d'activité détaillé

## Architecture

### Base de données
- **users:** Gestion des utilisateurs et authentification
- **files:** Stockage des métadonnées des fichiers
- **folders:** Organisation hiérarchique des fichiers
- **permissions:** Gestion des droits d'accès
- **activity_logs:** Historique des actions
- **reports:** Signalements de fichiers suspects
- **two_fa_sessions:** Sessions d'authentification 2FA

### API Routes
- `/api/auth/*` - Authentification et 2FA
- `/api/files/*` - Gestion des fichiers
- `/api/folders/*` - Gestion des dossiers
- `/api/users/*` - Gestion des utilisateurs
- `/api/stats/*` - Statistiques (admin)
- `/api/reports/*` - Gestion des signalements

### Pages Frontend
- `/` - Page de login
- `/auth/2fa` - Vérification 2FA
- `/dashboard` - Dashboard utilisateur
- `/dashboard/secretaire` - Dashboard secrétaire
- `/dashboard/admin` - Dashboard administrateur

## Dépannage

### Erreur de connexion à la base de données
Vérifiez que:
1. MySQL est en cours d'exécution
2. Les variables d'environnement dans `.env.local` sont correctes
3. La base de données `sonatrach_files` existe

### Erreur lors de l'upload de fichiers
Assurez-vous que le dossier `public/uploads` existe et est accessible en écriture.

## Support
Pour toute question ou problème, veuillez contacter l'équipe IT de SONATRACH.

## Utiliser Docker (option recommandé pour un environnement de dev reproductible)

Si vous préférez démarrer l'application localement avec Docker et une base MySQL tout prête, un fichier `docker-compose.yml` est fourni. Cela simplifie la configuration et évite des problèmes de version de dépendances.

1. Copier l'exemple d'environnement :

```powershell
cp .env.example .env.local
```

1. Démarrer les services :

```powershell
docker-compose up --build
```

Le service Next.js sera exposé sur le port 3000 et la base de données MySQL sur le port 3306. Le dossier `public/uploads` est monté dans le conteneur pour conserver les fichiers uploadés localement.

Notes:

- Le conteneur exécute `npm install --legacy-peer-deps` pendant le démarrage pour éviter d'arrêter sur des conflits de peer-dependencies en environnement de développement. Pour la production, vous devriez verrouiller et corriger les versions dans `package.json`.

- Le mot de passe MySQL par défaut dans `docker-compose.yml` est `secret` (changez-le pour prod).

## Laravel ?

Non — ce projet est une application Next.js (Node/React) avec API routes, et n'utilise pas Laravel. Laravel est un framework PHP. Vous n'avez pas besoin de Laravel pour exécuter ce projet.
