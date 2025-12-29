"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import { getUserProfile } from "@/integration/services/user";
import type { User } from "@/integration/types/api";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
    const params = useParams(); // Récupère l'ID depuis l'URL
    const { user: currentUser } = useAuth(); // Utilisateur connecté

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchProfile = useCallback(async () => {
        // Si pas d'ID, on arrête
        if (!params?.id) return;

        try {
            // Conversion de l'ID string en number
            const userId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id);

            if (isNaN(userId)) {
                setError("Identifiant utilisateur invalide");
                return;
            }

            const response = await getUserProfile(userId);
            if (response.success) {
                setProfileUser(response.user);
            } else {
                setError(response.message || "Impossible de récupérer le profil");
            }
        } catch (err) {
            console.error("Erreur chargement profil:", err);
            setError("Une erreur est survenue lors du chargement du profil");
        } finally {
            setIsLoading(false);
        }
    }, [params?.id]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error || !profileUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="text-xl font-bold text-error">{error || "Utilisateur introuvable"}</div>
                <a href="/" className="btn btn-neutral">Retour à l'accueil</a>
            </div>
        );
    }

    const isOwner = currentUser?.id === profileUser.id;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* --- En-tête du profil --- */}
            <div className="card bg-base-100 shadow-xl overflow-hidden mb-8">
                {/* Bannière décorative (pourrait être dynamique plus tard) */}
                <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 w-full"></div>

                <div className="card-body pt-0 relative">
                    <div className="flex flex-col md:flex-row gap-6 items-start">

                        {/* Avatar */}
                        <div className="-mt-16 relative">
                            <div className="avatar">
                                <div className="w-32 h-32 rounded-full ring ring-base-100 ring-offset-2 bg-base-200">
                                    {profileUser.profilePicture ? (
                                        <img
                                            src={profileUser.profilePicture}
                                            alt={profileUser.username}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full w-full bg-neutral text-neutral-content text-4xl font-bold">
                                            {profileUser.username.slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Infos principales */}
                        <div className="flex-1 mt-2 md:mt-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold">{profileUser.firstName} {profileUser.lastName}</h1>
                                    <p className="text-lg opacity-75">@{profileUser.username}</p>
                                    {profileUser.content && (
                                        <p className="mt-2 text-base max-w-2xl">{profileUser.content}</p>
                                    )}
                                    <div className="flex gap-4 mt-4 text-sm opacity-70">
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                            {profileUser.location || "Non renseigné"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0h18M5.25 12h13.5h-13.5Zm0 3.75h13.5h-13.5Z" />
                                            </svg>
                                            Membre depuis {new Date(profileUser.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    {isOwner ? (
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => setIsEditModalOpen(true)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                            Éditer le profil
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button className="btn btn-primary btn-sm">Suivre</button>
                                            <button className="btn btn-neutral btn-sm">Contacter</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- Compétences (Skills) --- */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.001 6.001 0 0 0-5.303-3M6.75 5.25a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v.008a2.25 2.25 0 0 1-2.25 2.25h-3a2.25 2.25 0 0 1-2.25-2.25v-.008Z" />
                            </svg>
                            Compétences
                        </h2>
                        <div className="divider my-0"></div>

                        {profileUser.skills && profileUser.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {profileUser.skills.map(skill => (
                                    <div key={skill.id} className="badge badge-primary badge-lg gap-2 p-4">
                                        {skill.title}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic opacity-60 mt-4">Aucune compétence renseignée.</p>
                        )}
                    </div>
                </div>

                {/* --- Intérêts (Interests) --- */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-secondary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                            Centres d&apos;intérêt
                        </h2>
                        <div className="divider my-0"></div>

                        {profileUser.interests && profileUser.interests.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {profileUser.interests.map(interest => (
                                    <div key={interest.id} className="badge badge-secondary badge-outline badge-lg gap-2 p-4">
                                        {interest.title}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic opacity-60 mt-4">Aucun centre d&apos;intérêt renseigné.</p>
                        )}
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={profileUser}
                onUpdate={fetchProfile}
            />
        </div>
    );
}
