// Bloc : liste courte de tutos favoris (aperçu)
import Link from "next/link";

// Structure type des données
export type FavoriteItem = {
  id: string;
  title: string;
  href?: string; // optionnel : lien direct vers le tuto
};

// Composant gérant la liste des favoris
export default function ProfileFavorites({
  username,
  items,
}: {
  username: string;
  items: FavoriteItem[];
}) {
  if (!items?.length) return null;

  return (
    <section className="card bg-base-200">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-schoolbell text-xl md:text-2xl text-cyan-500">Tutoriels favoris</h2>
          <span role="img" aria-label="favoris">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </span>
        </div>

        <div className="space-y-5">
          {items.map((t) => (
            <Link
              key={t.id}
              href={t.href ?? "/gallery"} // Fallback vers "/gallery" si t.href n'est pas défini
              className="btn btn-outline w-full justify-between"
            >
              <span className="truncate">{t.title}</span>
              <span aria-hidden>›</span>
            </Link>
          ))}
        </div>

        <div className="text-right mt-2">
          <Link
            href={`/profile/${username}/favourites`} // Lien vers la page complète des favoris de l'utilisateur
            className="link link-hover text-sm"
          >
            Voir tous les favoris
          </Link>
        </div>
      </div>
    </section>
  );
}
