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
    <h1 className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-green-300 hover:before:[box-shadow:_20px_20px_20px_30px_cyan] duration-500 before:duration-500 hover:duration-500 relative bg-neutral-800 h-16 w-64 border text-center p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-blue-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-green-300 after:right-8 after:top-3 after:rounded-full after:blur-lg uppercase">
      MES FAVORIS
    </h1>
  </div>
  <div className="item-center">
    <Link
      href="/"
      className="hover:text-primary transition-colors items-center flex gap-1 justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    </Link>
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
