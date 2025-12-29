"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLatestTutorials } from "@/integration/services/public";
import { Tutorial } from "@/integration/types/api";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";

export default function LatestTutorials() {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const handleProtectedClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            const modal = document.getElementById('login_modal') as HTMLDialogElement;
            if (modal) {
                modal.showModal();
            }
        }
    };

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const response = await getLatestTutorials();
                if (response.success) {
                    setTutorials(response.tutorials);
                }
            } catch (error) {
                console.error("Erreur chargement derniers tutoriels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTutorials();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (tutorials.length === 0) {
        return null; // On cache la section si pas de tutos
    }

    return (
        <section className="py-20 px-4 bg-base-100">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Derniers Tutoriels</h2>
                    <p className="opacity-60 max-w-xl mx-auto">
                        Apprenez de nouvelles compétences grâce à notre communauté.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutorials.map((tutorial) => (
                        <Link
                            href={`/tutorials/${tutorial.id}`} // Lien vers détail à implémenter plus tard (ou existant?)
                            key={tutorial.id}
                            className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            onClick={handleProtectedClick}
                        >
                            <figure className="h-48 relative">
                                {tutorial.picture ? (
                                    <img
                                        src={tutorial.picture}
                                        alt={tutorial.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full w-full bg-neutral text-neutral-content/30">
                                        <BookOpen className="w-12 h-12 mb-2" />
                                        <span className="text-sm">Pas d'image</span>
                                    </div>
                                )}
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title text-lg line-clamp-1">
                                    {tutorial.title}
                                </h3>
                                <p className="text-sm opacity-70 line-clamp-2">
                                    {tutorial.content}
                                </p>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-base-content/10">
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral-focus text-neutral-content rounded-full w-8 h-8">
                                            {tutorial.author.profilePicture ? (
                                                <img src={tutorial.author.profilePicture} alt={tutorial.author.username} />
                                            ) : (
                                                <span className="text-xs">{tutorial.author.username.slice(0, 2).toUpperCase()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold opacity-80">
                                        {tutorial.author.username}
                                    </span>
                                    <span className="text-xs opacity-50 ml-auto">
                                        {new Date(tutorial.publishedAt || tutorial.createdAt || new Date()).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/search?tab=tutorials"
                        className="btn btn-outline btn-primary"
                        onClick={handleProtectedClick}
                    >
                        {isAuthenticated ? "Voir tous les tutoriels" : "Se connecter pour voir les tutoriels"}
                    </Link>
                </div>
            </div>
        </section>
    );
}
