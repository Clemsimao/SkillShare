import { Tutorial } from "@/integration/types/api";
import Link from "next/link";
import { BookOpen, User } from "lucide-react";

interface TutorialResultsProps {
    tutorials: Tutorial[];
}

export default function TutorialResults({ tutorials }: TutorialResultsProps) {
    if (tutorials.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">Aucun tutoriel trouvé pour cette recherche.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
                <Link
                    href={`/tutorials/${tutorial.id}`}
                    key={tutorial.id}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer h-full"
                >
                    <figure className="h-48 overflow-hidden bg-base-300 relative">
                        {tutorial.picture ? (
                            <img
                                src={tutorial.picture}
                                alt={tutorial.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full w-full text-base-content/30">
                                <BookOpen className="w-12 h-12 mb-2" />
                                <span className="text-sm">Pas d'image</span>
                            </div>
                        )}
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title text-lg line-clamp-1">{tutorial.title}</h2>
                        <p className="text-sm text-gray-500 line-clamp-2">{tutorial.content}</p>

                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-base-200">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                                    {tutorial.author.profilePicture ? (
                                        <img src={tutorial.author.profilePicture} alt={tutorial.author.username} />
                                    ) : (
                                        <span className="text-xs">{tutorial.author.username.slice(0, 2).toUpperCase()}</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold">{tutorial.author.username}</p>
                                <p className="text-xs text-gray-500">Auteur</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
