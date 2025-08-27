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
          <h2 className="font-poppins text-xl md:text-2xl">Tutos favoris</h2>
          <span role="img" aria-label="favoris">❤️</span>
        </div>

        <div className="space-y-2">
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
