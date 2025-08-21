// Bloc : liste courte de tutos favoris (aperçu)
// - Chaque item peut avoir un href spécifique; sinon on met un fallback.
// - Le lien "Voir tous" envoie vers /profile/[username]/favorites.

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
            //  utilisation du nullish coalescing (??) pour fournir une URL de secours
            // Si le tuto a sa propre URL (t.href), elle est utilisé sinon page de gallery par défault
            href={t.href ?? "/gallery"} // TODO: remplacer par l'URL réelle de tuto
              className="btn btn-outline w-full justify-between"
            >
                {/* Afficher le titre du tutoriel */}
              <span className="truncate">{t.title}</span>
              <span aria-hidden>›</span>
            </Link>
          ))}
        </div>

        <div className="text-right mt-2">
            {/* Le lien de navigation mène à la page complète des favoris de l'utilisateur. */}
          <Link
            href={`/profile/${username}/favorites`}
            className="link link-hover text-sm"
          >
            Voir tous les favoris
          </Link>
        </div>
      </div>
    </section>
  );
}
