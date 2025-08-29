import Link from "next/link";

const ACCENT = "#19362D";

type Profile = { id: string; name: string; avatarUrl?: string };

type Props = {
  title?: string;
  author?: string;
  summary?: string;
  posterUrl?: string;
  profiles?: Profile[];
};

// --- Composant contentPreview ------
export default function ContentPreview({
  title = "Titre du tuto",
  author = "Nom de l'auteur",
  summary = "Artiste et formateur passionné par l’illustration et la photo. Je met à votre disposition mes compétences et mon expérience. Je peux vous aider à apprendre les bases de la photographie et de rendre jolis vos souvenirs les plus inoubliables. La photo c'est la vie",
  posterUrl = "https://source.unsplash.com/960x540/?learning",
  profiles = DEFAULT_PROFILES,
}: Props) {
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
        <h3 className="text-mdfont-medium mb-3 font-schoolbell text-cyan-500">
          Profils que vous pourriez apprécier…
        </h3>
        <ul className="flex flex-col gap-3">
          {profiles.slice(0, 3).map((p) => (
            <li
              key={p.id}
              className="bg-base-100 rounded-lg shadow-md p-3 flex items-center gap-3"
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
              <Link
                href={`/profile/${p.id}`}
                className="btn btn-dash btn-secondary"
              >
                Voir
              </Link>
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
