"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTutorial } from "@/integration/services/tutorials";
import { Tutorial } from "@/integration/types/api";

export default function TutorialDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTutorial = async () => {
      try {
        setLoading(true);
        // L'ID dans l'URL est une string, il faut le convertir en number pour l'API
        const tutorialId = Number(id);
        if (isNaN(tutorialId)) {
          setError("ID invalide.");
          setLoading(false);
          return;
        }

        const response = await getTutorial(tutorialId);
        if (response.success && response.tutorial) {
          setTutorial(response.tutorial);
        } else {
          setError("Impossible de charger le tutoriel.");
        }
      } catch (err) {
        console.error("Erreur chargement tuto:", err);
        setError("Erreur lors du chargement.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-error">Oups !</h2>
        <p>{error || "Tutoriel introuvable."}</p>
        <button onClick={() => window.location.reload()} className="btn btn-outline">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
      {/* ---------- 1) En-tête ---------- */}
      <header className="space-y-1 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#19362D]">
          {tutorial.title}
        </h1>
        {tutorial.author && (
          <p className="text-sm text-gray-500">Par {tutorial.author.username}</p>
        )}
        {tutorial.publishedAt && (
          <p className="text-xs text-gray-400">
            Publié le {new Date(tutorial.publishedAt).toLocaleDateString()}
          </p>
        )}
      </header>

      {/* ---------- 2) Média ---------- */}
      <section>
        <div className="w-full aspect-video rounded-xl bg-base-100 flex items-center justify-center shadow-lg overflow-hidden relative">
          {tutorial.videoLink ? (
            <iframe
              src={tutorial.videoLink.replace("watch?v=", "embed/")}
              className="w-full h-full object-cover"
              allowFullScreen
              title={tutorial.title}
            ></iframe>
          ) : tutorial.picture ? (
            <img
              src={tutorial.picture}
              alt={tutorial.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="placeholder bg-base-300 text-base-content rounded-md w-20 h-20 flex items-center justify-center shadow-md">
              <span className="text-xs">IMG</span>
            </div>
          )}
        </div>
      </section>

      {/* ---------- 3) Contenu du tuto ---------- */}
      <article className="bg-base-200 rounded-xl p-6 shadow-xl leading-relaxed border-l-4 border-[#19362D] whitespace-pre-wrap">
        {tutorial.content}
      </article>

      {/* ---------- 4) Commentaires (Placeholder pour le moment) ---------- */}
      <section aria-label="Commentaires" className="space-y-4">
        <h2 className="text-xl font-semibold text-[#19362D]">
          Commentaires
        </h2>

        <div className="bg-base-200 rounded-xl p-4 border border-dashed border-[#19362D] shadow-inner">
          <p className="text-sm text-gray-500">
            Fonctionnalité de commentaires à venir.
          </p>
        </div>
      </section>
    </main>
  );
}
