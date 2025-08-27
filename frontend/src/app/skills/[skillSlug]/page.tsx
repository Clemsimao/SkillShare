// src/app/skills/[skillSlug]/page.tsx
import Link from "next/link";

import { notFound } from "next/navigation";

// la logique de récupération de données (data fetching) (connexion à l'API backend)
import { getSkillBySlug, getTutorialsBySkill } from "@/lib/api-client";

// ======================================================
// Mock de données fictives : pour tester l'affichage de la page
// Ces données remplacent temporairement les données du backend.
// À supprimer ou commenter quand le backend sera connecté.
// ======================================================
const MOCK_SKILL = { slug: "dessin", name: "Dessin", description: "Apprendre les bases du dessin" };
const MOCK_TUTORIALS = [
  { id: "1", title: "Tuto 1", summary: "Introduction au dessin", coverUrl: "", skillSlug: "dessin" },
  { id: "2", title: "Tuto 2", summary: "Les proportions", coverUrl: "", skillSlug: "dessin" },
  { id: "3", title: "Tuto 3", summary: "La perspective", coverUrl: "", skillSlug: "dessin" },
  { id: "4", title: "Tuto 4", summary: "Ombres et lumières", coverUrl: "", skillSlug: "dessin" },
  { id: "5", title: "Tuto 5", summary: "Ma palette favorite", coverUrl: "", skillSlug: "dessin" },
  { id: "6", title: "Tuto 6", summary: "Couleur épourée", coverUrl: "", skillSlug: "dessin" }
];

// PAGE_SIZE: nombre d'éléments par page 6 
const PAGE_SIZE = 6;

//-------- Helpers de pagination - fonctions pures et simples------------

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

  //*****************Forcer les données fictives pour tester l'affichage de la liste des tutos */
  // à remplir lorsque le front sera connecté au back
  // Mode mock (toggle) pour forcer l'usage des données fictives
  // Mettre USE_MOCK = false quand l'API est prête

  const USE_MOCK = true;

  let skill: any; 
  let items: any[] = [];
  let total = 0;

  if (USE_MOCK) {
    // --- utiliser le mock sans toucher au reste de la page ---
    skill = skillSlug === MOCK_SKILL.slug ? MOCK_SKILL : null;
    if (!skill) return notFound();
    items = MOCK_TUTORIALS.filter((t) => t.skillSlug === skillSlug);
    total = items.length;
  } else {
    // Charger le skill - si introuvable => 404
    skill = await getSkillBySlug(skillSlug);
    if (!skill) return notFound();

    // Charger les tutos + total des tutos
    const resp = await getTutorialsBySkill(skillSlug, {
      page: currentPage,
      pageSize: PAGE_SIZE,
    });
    items = resp.items;
    total = resp.total;
  }

  // Calculer le nombre total de pages (≥ 1)
  const totalPages = calcTotalPages(total, PAGE_SIZE);

  // --------Render principal - retourner la structure de la page----------- 
  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
      {/* Entête de page: afficher le nom du skill (catégorie choisie)*/}
      <header className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1D4ED8]">
          {skill.name}
        </h1>
        {skill.description ? (
          <p className="text-sm md:text-base text-[#334155] opacity-80">
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
            className="card bg-base-200 shadow-md rounded-xl transition-colors"
          >
            <Link href={`/tutorials/${tuto.id}`} className="block p-4">
              {/* Titre de la carte: identifier le contenu */}
              <h2 className="text-lg font-medium font-bold mb-2 line-clamp-1 text-[#1D4ED8]">
                {tuto.title}
              </h2>

              {/* image tuto - réserver un espace visuel constant*/}
              <div className="mb-3">
                <div className="w-full aspect-video rounded-md bg-white border border-[#E2E8F0] flex items-center justify-center">
                  {/* Afficher une image si disponible, sinon un pictogramme simple */}
                  {tuto.coverUrl ? (
                    // OPTIONNEL => Laisser Next/Image pour plus tard si besoin d'optimisation
                    // <Image src={tuto.coverUrl} alt="" fill className="object-cover rounded-md" />
                    <img
                      src={tuto.coverUrl}
                      alt=""
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="placeholder bg-base-300 text-base-content rounded-md w-16 h-16 flex items-center justify-center">
                    <span className="text-xs">IMG</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Extrait : donner du contexte court */}
              {tuto.summary && (
                <p className="text-sm text-[#334155] opacity-80 line-clamp-2">
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
                className="px-3 py-1 rounded-md bg-[#1D4ED8] text-white text-sm"
              >
                {p}
              </span>
            ) : (
              // Lien de page: garder la route et modifier seulement ?page=
              <Link
                key={p}
                href={`/skills/${skillSlug}?page=${p}`}
                className="px-3 py-1 rounded-md bg-[#F8FAFC] hover:bg-[#06B6D4]/20 text-sm text-[#334155]"
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
