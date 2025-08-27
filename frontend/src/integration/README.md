# Intégration Frontend-Backend SkillSwap

Ce dossier contient tous les fichiers nécessaires pour connecter le frontend Next.js au backend Node.js/Express.

## Structure des fichiers

```
src/integration/
├── types/
│   └── api.ts              # Types TypeScript basés sur le backend
├── lib/
│   ├── config.ts           # Configuration API et endpoints
│   ├── http-client.ts      # Client Axios avec intercepteurs JWT
│   └── token.ts            # Gestionnaire de tokens JWT
├── services/
│   ├── auth.ts             # Services d'authentification
│   ├── public.ts           # Services publics (sans auth)
│   ├── users.ts            # Gestion des profils utilisateurs
│   ├── tutorials.ts        # CRUD tutoriels
│   ├── search.ts           # Recherche utilisateurs/tutoriels
│   └── comments.ts         # Gestion des commentaires
├── hooks/
│   ├── use-auth.ts         # Hook d'authentification React
│   ├── use-api.ts          # Hook générique pour appels API
│   └── use-skills.ts       # Hook pour compétences/catégories
└── README.md               # Ce fichier
```

## Installation des dépendances

```bash
# Dans le dossier frontend/
npm install axios @types/axios js-cookie @types/js-cookie
```

## Configuration

1. **Variables d'environnement** - Dans `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

2. **Import dans votre app** - Dans votre composant principal :

```typescript
import { useAuth } from "@/integration/hooks/use-auth";
import { useSkills } from "@/integration/hooks/use-skills";
```

## Exemples d'utilisation

### 1. Authentification

```typescript
'use client';
import { useAuth } from '@/integration/hooks/use-auth';

export default function LoginPage() {
  const { login, status, error, isLoggedIn } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await login({
      email: 'user@example.com',
      password: 'password123'
    });

    if (success) {
      router.push('/dashboard');
    }
  };

  if (isLoggedIn) return <div>Déjà connecté!</div>;

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}
```

### 2. Chargement des compétences

```typescript
'use client';
import { useSkills } from '@/integration/hooks/use-skills';

export default function SkillsPage() {
  const { skills, categories, isLoading, getSkillsByCategory } = useSkills();

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.title}</h2>
          {getSkillsByCategory(category.id).map(skill => (
            <span key={skill.id}>{skill.title}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### 3. Appels API directs

```typescript
import { getAllTutorials } from '@/integration/services/tutorials';
import { searchUsers } from '@/integration/services/search';

// Dans un composant serveur Next.js
export default async function TutorialsPage() {
  const tutorials = await getAllTutorials();

  return (
    <div>
      {tutorials.tutorials.map(tutorial => (
        <article key={tutorial.id}>
          <h2>{tutorial.title}</h2>
          <p>{tutorial.content}</p>
        </article>
      ))}
    </div>
  );
}

// Dans un composant client avec état
export default function SearchPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (skillId: number) => {
    setLoading(true);
    try {
      const response = await searchUsers({ skillId, page: 1 });
      setResults(response);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Interface de recherche */}
    </div>
  );
}
```

### 4. Gestion des commentaires

```typescript
import { useApi } from '@/integration/hooks/use-api';
import {
  getCommentsByTutorial,
  createComment
} from '@/integration/services/comments';

export default function CommentsSection({ tutorialId }: { tutorialId: number }) {
  const commentsApi = useApi(() => getCommentsByTutorial(tutorialId));
  const createCommentApi = useApi(createComment);

  useEffect(() => {
    commentsApi.execute();
  }, [tutorialId]);

  const handleSubmit = async (content: string) => {
    const success = await createCommentApi.execute({
      tutorial_id: tutorialId,
      content
    });

    if (success) {
      // Recharger les commentaires
      commentsApi.execute();
    }
  };

  return (
    <div>
      {commentsApi.data?.data.map(comment => (
        <div key={comment.comment_id}>
          <strong>{comment.author.username}</strong>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
```

## Migration depuis l'architecture existante

### Étapes de migration :

1. **Copier les fichiers** de `integration/` vers `src/`
2. **Remplacer les imports** dans vos composants existants
3. **Mettre à jour les types** pour utiliser ceux de `types/api.ts`
4. **Tester les endpoints** un par un

### Mapping des anciens vs nouveaux fichiers :

```
Ancien                    → Nouveau
src/lib/api-client.ts    → src/integration/services/*.ts
src/types/user.ts        → src/integration/types/api.ts
données hardcodées       → appels API réels
```

## Tests d'intégration

Pour tester la connexion backend :

```typescript
// Test de santé de l'API
import { getApiHealth } from "@/integration/services/public";

const testConnection = async () => {
  try {
    const health = await getApiHealth();
    console.log("✅ API connectée:", health.message);
  } catch (error) {
    console.error("❌ API non accessible:", error);
  }
};
```

## Notes importantes

- **Types cohérents** : Tous les types correspondent exactement au backend analysé
- **Gestion d'erreurs** : Intercepteurs automatiques pour les erreurs 401
- **Tokens JWT** : Stockage et envoi automatiques
- **Server/Client Components** : Compatible Next.js App Router
- **TypeScript strict** : Toutes les réponses API typées

## Prochaines étapes

1. Intégrer ces fichiers dans votre architecture existante
2. Remplacer progressivement les données mockées
3. Tester tous les endpoints avec le backend
4. Ajouter la gestion d'erreurs dans l'UI
5. Implémenter les states de chargement

## Support

En cas de problème :

1. Vérifier que le backend est démarré sur `localhost:8000`
2. Contrôler les variables d'environnement
3. Examiner la console pour les erreurs réseau
4. Valider que les types correspondent aux réponses API réelles
