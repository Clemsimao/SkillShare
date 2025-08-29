import Link from "next/link";

const ACCENT = "#19362D";

type Profile = { id: string; name: string; avatarUrl?: string };

type Props = {
  title?: string;
  author?: string;
  summary?: string;
  posterUrl?: string;
  profiles?: Profile[];
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
};

// --- Composant contentPreview ------
export default function ContentPreview({
  title = "Titre du tuto",
  author = "Nom de l'auteur",
  summary = "Artiste et formateur passionné par l'illustration et la photo. Je met à votre disposition mes compétences et mon expérience. Je peux vous aider à apprendre les bases de la photographie et de rendre jolis vos souvenirs les plus inoubliables. La photo c'est la vie",
  posterUrl = "https://source.unsplash.com/960x540/?learning",
  profiles = DEFAULT_PROFILES,
  isLoggedIn = false,
  onLoginClick,
}: Props) {

  // Icône verrou pour profils protégés
  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 opacity-60">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );

  const handleProfileClick = (profileId: string) => {
    if (!isLoggedIn) {
      alert("Connectez-vous pour accéder aux profils des utilisateurs")
      return
    }
    // Redirection normale pour utilisateurs connectés
    window.location.href = `/profile/${profileId}`
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4">
      {/* Bloc preview d'un tuto */}
      <div className="rounded-xl bg-base-200 shadow-lg p-4 mb-4">
        {/* En-tête du tuto */}
        <header className="space-y-1 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-base-content font-schoolbell text-cyan-500">
            {title}
          </h2>
          {author && <p className="text-sm text-gray-500">Par {author}</p>}
          {summary && (
            <p className="text-base text-gray-600 italic">{summary}</p>
          )}
        </header>
        
        {/* Média du tuto */}
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-base-100 shadow-md border border-[#334155] rounded-lg flex justify-center items-center">
          <img
            src={
              "https://cdn.pixabay.com/photo/2016/11/29/04/54/photographer-1867417_1280.jpg"
            }
            alt="Aperçu du tutoriel"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bloc profils (en dessous, max 3) */}
      <div className="rounded-xl bg-base-200 shadow-lg p-4 rounded-lg">
        <h3 className="text-md font-medium mb-3 font-schoolbell text-cyan-500">
          Profils que vous pourriez apprécier…
        </h3>

        {/* Message d'avertissement si non connecté */}
        {!isLoggedIn && profiles.length > 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <LockIcon />
              <span className="text-sm font-medium text-warning-content">
                Connexion requise
              </span>
            </div>
            <p className="text-xs text-base-content/70 mb-2">
              Connectez-vous pour accéder aux profils des utilisateurs
            </p>
            <button 
              onClick={onLoginClick}
              className="btn btn-xs btn-warning"
            >
              Se connecter
            </button>
          </div>
        )}

        <ul className="flex flex-col gap-3">
          {profiles.slice(0, 3).map((p) => (
            <li
              key={p.id}
              className={`bg-base-100 rounded-lg shadow-md p-3 flex items-center gap-3 ${
                isLoggedIn 
                  ? 'hover:bg-base-200 cursor-pointer' 
                  : 'opacity-75 cursor-not-allowed'
              }`}
              onClick={() => handleProfileClick(p.id)}
            >
              <div className="avatar">
                <div
                  className="w-12 rounded-full ring"
                  style={{ borderColor: ACCENT }}
                >
                  <img
                    src={
                      p.avatarUrl ||
                      `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(p.name)}`
                    }
                    alt={p.name}
                  />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{p.name}</p>
              </div>
              <div className="flex items-center gap-2">
                {!isLoggedIn && <LockIcon />}
                <span className={`btn btn-dash btn-secondary ${!isLoggedIn ? 'btn-disabled' : ''}`}>
                  Voir
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const DEFAULT_PROFILES: Profile[] = [
  { id: "72", name: "Profil 72" },
  { id: "29", name: "Profil 29" },
  { id: "107", name: "Profil 107" },
  { id: "45", name: "Profil 45" },
  { id: "88", name: "Profil 88" },
];