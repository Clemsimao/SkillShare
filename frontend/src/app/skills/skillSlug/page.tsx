// src/app/skills/[skillSlug]/page.tsx
import Link form "next/link";

import { notFound } from "next/navigation";

// la logique de récupération de données (data fetching) (connexion à l'API backend)
import { getSkillBySlug, getTutorialsBySkill } from "@/lib/api-client";

// PAGE_SIZE: nombre d'éléments par page  
const PAGE_SIZE = 6;

 
//--------  Helpers de pagination - fonctions pures et simples------------
 
// calculer le nombre total de pages
function calcTotalPages(totalItems: number, pageSize: number) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
// convertir un paramètre "page" en entier ≥1
function numFromSearchParam(value: string | string[] | undefined) {
  const n = typeof value === "string" ? parseInt(value, 10) : NaN;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

//--------  Composant page liste des tutos------------
export default async function SkillListPage({
  params,
  searchParams,
}: {
  params: { skillSlug: string };
  searchParams?: { [k: string]: string | string[] | undefined };
}) {
  // Récupérer le slug courant
  const { skillSlug } = params;

  // Lire la page demandée depuis l'URL
  const currentPage = numFromSearchParam(searchParams?.page);

  // Charger le skill - si introuvable => 404
  const skill = await getSkillBySlug(skillSlug);
  if (!skill) return notFound();

  // Charger les tutos + total des tutos
  const { items, total } = await getTutorialsBySkill(skillSlug, {
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  // Calculer le nombre total de pages (≥ 1)
  const totalPages = calcTotalPages(total, PAGE_SIZE);


  // -----------------Render principal - retourner la structure de la page-----------------
  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
      {/* Entête de page: afficher le nom du skill (catégorie choisie)*/}
      <header className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold">
          {skill.name}
        </h1>
        {skill.description ? (
          <p className="text-sm md:text-base opacity-70">
            {skill.description}
          </p>
        ) : null}
      </header>

      {/* Grille des tutos : afficher des cartes 2 colonne*/}
      <section
        aria-label="Liste des tutoriels"
        className="grid gap-4 sm:grid-cols-2"
      >
        {items.length === 0 && (
          <div className="col-span-full">
            <div className="alert">
              <span>Aucun tuto disponible pour cette compétence pour le moment.</span>
            </div>
          </div>
        )}

        {items.map((tuto) => (
          <article
            key={tuto.id}
            className="card bg-base-200 hover:bg-base-300 transition-colors rounded-xl"
          >
            <Link href={`/tutorials/${tuto.id}`} className="block p-4">
              {/* Titre de la carte: identifier le contenu */}
              <h2 className="text-lg font-medium mb-2 line-clamp-1">
                {tuto.title}
              </h2>

              {/* image tuto - réserver un espace visuel constant*/}
              <div className="mb-3">
                <div className="w-full aspect-video rounded-md bg-base-100 flex items-center justify-center">
                  {/* Afficher une image si disponible, sinon un pictogramme simple */}
                  {tuto.coverUrl ? (
                    // Laisser Next/Image pour plus tard si besoin d'optimisation
                    // <Image src={tuto.coverUrl} alt="" fill className="object-cover rounded-md" />
                    <img
                      src={tuto.coverUrl}
                      alt=""
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="opacity-40 text-sm">Aperçu</div>
                  )}
                </div>
              </div>

              {/* Extrait : donner du contexte court */}
              {tuto.summary && (
                <p className="text-sm opacity-80 line-clamp-2">
                  {tuto.summary}
                </p>
              )}
            </Link>
          </article>
        ))}
      </section>

      {/* -Pagination - afficher "1, 2, 3, 4"-*/}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-center gap-2 pt-2"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === currentPage;
            return isActive ? (
              // Page active: ne pas créer de lien, marquer visuellement
              <span
                key={p}
                aria-current="page"
                className="px-3 py-1 rounded-md bg-neutral text-neutral-content text-sm"
              >
                {p}
              </span>
            ) : (
              // Lien de page: garder la route et modifier seulement ?page=
              <Link
                key={p}
                href={`/skills/${skillSlug}?page=${p}`}
                className="px-3 py-1 rounded-md bg-base-200 hover:bg-base-300 text-sm"
              >
                {p}
              </Link>
            );
          })}
        </nav>
      )}
    </main>
  );
}
 
 