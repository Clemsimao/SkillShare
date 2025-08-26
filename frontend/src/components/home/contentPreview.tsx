// src/components/home/ContentPreview.tsx
// Afficher (1) un visuel "preview" et (2) 3 cartes profils en dessous.

import Link from "next/link";


const ACCENT = "#19362D";  

type Profile = { id: string; name: string; avatarUrl?: string };

type Props = {
  title?: string;             
  posterUrl?: string;        // image du preview (sinon fallback)
  profiles?: Profile[];      // 3 profils max
};

// --- Composant contentPreview ------
export default function ContentPreview({
  title = "Preview d’un tuto",
  posterUrl = "https://source.unsplash.com/960x540/?learning",
  profiles = DEFAULT_PROFILES,
}: Props) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4">
      {/* Bloc preview d'un tuto */}
      <div className="rounded-xl bg-base-200 shadow-lg p-4 mb-4 border"
           style={{ borderColor: ACCENT }}>
        <h2 className="text-base font-semibold mb-3" style={{ color: ACCENT }}>
          {title}
        </h2>
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-base-100 shadow-md">
          <img src={posterUrl} alt="Aperçu" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Bloc profils */}
      <div className="rounded-xl bg-base-200 shadow-lg p-4 border"
           style={{ borderColor: ACCENT }}>
        <h3 className="text-sm font-medium mb-3">Profils que vous pourriez apprécier…</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profiles.slice(0, 3).map((p) => (
            <li key={p.id} className="bg-base-100 rounded-lg shadow-md p-3 flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full ring" style={{ borderColor: ACCENT }}>
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
                className="btn btn-xs text-white"
                style={{ backgroundColor: ACCENT, borderColor: ACCENT }}
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
];
