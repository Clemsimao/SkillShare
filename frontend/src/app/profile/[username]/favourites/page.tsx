// src/app/favourites/page.tsx
import Link from 'next/link';

export default function FavouritesPage() {
  // Données simulées de favoris - à remplacer par les db du back
  const favourites = [
    { id: 1, title: 'Apprendre la guitare', category: 'Musique', date: '12/08/2025' },
    { id: 2, title: 'Yoga du matin', category: 'Bien-être', date: '10/08/2025' },
    { id: 3, title: 'Recette de pain maison', category: 'Vie Pratique', date: '05/08/2025' },
    { id: 4, title: 'Dessin au crayon', category: 'Art', date: '01/08/2025' },
  ];

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-8">
      {/* En-tête de la page */}
      <div className="mb-8 flex justify-center">
        <h1 className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-green-300 hover:before:[box-shadow:_20px_20px_20px_30px_cyan] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-center hover:scale-105 relative bg-base-200 h-16 w-64 border text-left p-3 text-base-500 font-bold uppercase rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-blue-400 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-green-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
        Mes Favoris
        </h1>
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
