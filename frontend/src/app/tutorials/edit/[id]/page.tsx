"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTutorial } from "@/integration/services/tutorials";
import { Tutorial } from "@/integration/types/api";
import { useAuth } from "@/context/AuthProvider";
import TutorialForm from "@/components/tutorials/TutorialForm";

export default function EditTutorialPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const id = params?.id as string;
    const [tutorial, setTutorial] = useState<Tutorial | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Redirection si non connecté
        if (!isAuthenticated && !loading) {
            router.push('/');
            return;
        }

        if (!id) return;

        const fetchTutorial = async () => {
            try {
                setLoading(true);
                const tutorialId = Number(id);
                if (isNaN(tutorialId)) {
                    setError("ID invalide.");
                    setLoading(false);
                    return;
                }

                const response = await getTutorial(tutorialId);
                if (response.success && response.tutorial) {
                    // Vérification que c'est bien l'auteur
                    if (user && response.tutorial.author.id !== user.id) {
                        setError("Vous n'êtes pas autorisé à modifier ce tutoriel.");
                    } else {
                        setTutorial(response.tutorial);
                    }
                } else {
                    setError("Impossible de charger le tutoriel.");
                }
            } catch (err) {
                console.error("Erreur chargement tuto pour édition:", err);
                setError("Erreur lors du chargement.");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && user) {
            fetchTutorial();
        }
    }, [id, isAuthenticated, user, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error || !tutorial) {
        return (
            <div className="min-h-screen bg-base-100 flex flex-col justify-center items-center space-y-4">
                <h2 className="text-2xl font-bold text-error">Accès refusé ou erreur</h2>
                <p>{error || "Tutoriel introuvable."}</p>
                <button onClick={() => router.back()} className="btn btn-outline">
                    Retour
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-base-100 px-4 py-8 flex flex-col items-center">
            <TutorialForm initialData={tutorial} isEditing={true} />
        </main>
    );
}
