// src/app/tutorials/[id]/page.tsx

import { notFound } from "next/navigation";

// Mock de données pour tester sans backend

type Tutorial = {
  id: string;
  title: string;
  author?: string;
  coverUrl?: string;
  summary?: string;
  content: string;
};

type Comment = {
  id: string;
  tutorialId: string;
  author: string;
  content: string;
  createdAt: string; // ISO string
};

// Données fictives TUTOS pour tester l'affichage
const MOCK_TUTORIALS: Tutorial[] = [
  {
    id: "1",
    title: "Tuto 1",
    author: "Mathieu Dupont",
    summary: "Introduction au dessin",
    content:
      "Découvrir les bases: tenue du crayon, types de traits, échauffements. Travailler la régularité avec des exercices courts.",
   
  },
  {
    id: "2",
    title: "Tuto 2",
    author: "Amina R.",
    summary: "Les proportions",
    content:
      "Comprendre les repères, la construction en formes simples, la mesure comparative et le négatif.",
 
  },
];

// Données fictives COMMENTAIRES pour tester l'affichage
const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    tutorialId: "1",
    author: "Nora",
    content: "Très clair, merci pour les exos d’échauffement !",
    createdAt: "2025-08-25T08:05:00.000Z",
  },
  {
    id: "c2",
    tutorialId: "1",
    author: "Samir",
    content: "Ça m’a aidé à corriger ma tenue du crayon.",
    createdAt: "2025-08-25T09:10:00.000Z",
  },
];

// Fonctions mock
async function getTutorialById(id: string): Promise<Tutorial | null> {
  return MOCK_TUTORIALS.find((t) => t.id === id) ?? null;
}
async function getCommentsByTutorial(id: string): Promise<Comment[]> {
  return MOCK_COMMENTS.filter((c) => c.tutorialId === id);
}

// ----------------- Composant (Page) détail d’un tuto -----------------
export default async function TutorialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const tuto = await getTutorialById(id);
  if (!tuto) return notFound();

  const comments = await getCommentsByTutorial(id);

  return (
    <main className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
      {/* ---------- 1) En-tête ---------- */}
      <header className="space-y-1 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#19362D]">
          {tuto.title}
        </h1>
        {tuto.author && (
          <p className="text-sm text-gray-500">Par {tuto.author}</p>
        )}
        {tuto.summary && (
          <p className="text-base text-gray-600 italic">{tuto.summary}</p>
        )}
      </header>

      {/* ---------- 2) Média ---------- */}
      <section>
        <div className="w-full aspect-video rounded-xl bg-base-100 flex items-center justify-center shadow-lg">
          {tuto.coverUrl ? (
            <img
              src={tuto.coverUrl}
              alt=""
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="placeholder bg-base-300 text-base-content rounded-md w-20 h-20 flex items-center justify-center shadow-md">
              <span className="text-xs">IMG</span>
            </div>
          )}
        </div>
      </section>

      {/* ---------- 3) Contenu du tuto ---------- */}
      <article className="bg-base-200 rounded-xl p-6 shadow-xl leading-relaxed border-l-4 border-[#19362D]">
        {tuto.content}
      </article>

      {/* ---------- 4) Commentaires ---------- */}
      <section aria-label="Commentaires" className="space-y-4">
        <h2 className="text-xl font-semibold text-[#19362D]">
          Commentaires ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="opacity-70">Aucun commentaire pour le moment.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c.id}
                className="bg-base-200 rounded-xl p-4 shadow-md border border-gray-200"
              >
                <div className="text-sm text-gray-500 mb-1">
                  <span className="font-medium text-[#19362D]">
                    {c.author}
                  </span>{" "}
                  •{" "}
                  {new Date(c.createdAt).toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
                <p className="text-sm">{c.content}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="bg-base-200 rounded-xl p-4 border border-dashed border-[#19362D] shadow-inner">
          <p className="text-sm text-gray-500">
            Formulaire d’ajout de commentaire à intégrer (V1 backend).
          </p>
        </div>
      </section>
    </main>
  );
}
