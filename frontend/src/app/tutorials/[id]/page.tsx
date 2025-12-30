"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { getTutorial } from "@/integration/services/tutorials";
import { Tutorial } from "@/integration/types/api";

export default function TutorialDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
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
      <header className="space-y-1 text-center relative group">
        <h1 className="text-3xl md:text-4xl font-bold text-[#19362D] inline-block relative">
          {tutorial.title}
          {user && tutorial.author.id === user.id && (
            <Link
              href={`/tutorials/edit/${tutorial.id}`}
              className="absolute -right-12 top-1/2 -translate-y-1/2 btn btn-sm btn-circle btn-ghost text-gray-500 hover:text-primary tooltip tooltip-right"
              data-tip="Éditer le tutoriel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </Link>
          )}
        </h1>
        {tutorial.author && (
          <p className="text-sm text-gray-500">
            Par{' '}
            <Link
              href={`/profile/${tutorial.author.id}`}
              className="text-current hover:text-primary hover:underline transition-colors font-medium"
            >
              {tutorial.author.username}
            </Link>
          </p>
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
