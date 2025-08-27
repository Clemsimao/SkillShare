// src/app/favourites/page.tsx
import Link from 'next/link';

export default function FavouritesPage() {
  // Données simulées de favoris
  const favourites = [
    { id: 1, title: 'Apprendre la guitare', category: 'Musique', date: '12/08/2025' },
    { id: 2, title: 'Yoga du matin', category: 'Bien-être', date: '10/08/2025' },
    { id: 3, title: 'Recette de pain maison', category: 'Vie Pratique', date: '05/08/2025' },
    { id: 4, title: 'Dessin au crayon', category: 'Art', date: '01/08/2025' },
  ];

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-8">
      {/* En-tête de la page */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Mes Favoris</h1>
        <div className="text-center">
          <Link
            href="/"
            className="link link-hover text-sm text-base-content/70"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* Liste des favoris */}
      <div className="max-w-3xl mx-auto">
        {favourites.length === 0 ? (
          <div className="bg-base-200 p-8 rounded-lg text-center">
            <p className="text-lg">Tu n'as pas encore de favoris.</p>
            <p className="text-sm mt-2">Explore les catégories pour en ajouter !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favourites.map((favourite) => (
              <div
                key={favourite.id}
                className="bg-base-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{favourite.title}</h3>
                    <p className="text-sm text-base-content/70">
                      {favourite.category} • {favourite.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-outline">
                      Voir
                    </button>
                    <button className="btn btn-sm btn-ghost">
                      ✖ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
