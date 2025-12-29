"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { getExampleProfiles } from "@/integration/services/public";
import type { User } from "@/integration/types/api";
import { useAuth } from "@/context/AuthProvider";
import LatestTutorials from "@/components/home/LatestTutorials";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [profiles, setProfiles] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchProfiles = async () => {
      try {
        const response = await getExampleProfiles(4);
        if (response.success) {
          setProfiles(response.users);
        }
      } catch (err) {
        console.error("Erreur chargement profils landing:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-base-100 font-[family-name:var(--font-geist-sans)]">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background avec overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-transparent to-base-300 opacity-90"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
            alt="Collaboration"
            className="w-full h-full object-cover grayscale opacity-20"
          />
        </div>

        <div className="relative z-10 max-w-4xl space-y-8 animate-fade-in-up">
          <div className="badge badge-accent badge-outline mb-4">Beta v1.0</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 drop-shadow-sm">
            Echangez vos <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-gradient-xy">
              SAVOIRS
            </span>
          </h1>

          <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto leading-relaxed">
            SkillShare est la première plateforme communautaire d&apos;échange de compétences. Apprenez de vos pairs, partagez votre expertise, gratuitement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {!isAuthenticated && (
              <Link href="/signup" className="btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform duration-200 group">
                Rejoindre la communauté
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}

            {isAuthenticated && (
              <>
                <Link href="/search" className="btn btn-outline btn-lg backdrop-blur-sm hover:bg-base-content hover:text-base-100">
                  Découvrir les talents
                </Link>
                <Link href="/search?tab=tutorials" className="btn btn-outline btn-lg backdrop-blur-sm hover:bg-base-content hover:text-base-100">
                  Consulter les tutoriels
                </Link>
              </>
            )}
          </div>

          {/* Stats rapides */}
          <div className="flex gap-8 justify-center mt-12 opacity-70 text-sm font-mono">
            <div>
              <span className="font-bold text-xl block text-primary">+50</span>
              Domaines
            </div>
            <div className="divider divider-horizontal mx-0"></div>
            <div>
              <span className="font-bold text-xl block text-secondary">Free</span>
              Open Source
            </div>
            <div className="divider divider-horizontal mx-0"></div>
            <div>
              <span className="font-bold text-xl block text-accent">100%</span>
              Communautaire
            </div>
          </div>
        </div>
      </section>

      {/* --- LATEST TUTORIALS SECTION --- */}
      <LatestTutorials />

      {/* --- FEATURED PROFILES SECTION --- */}
      <section className="py-20 px-8 bg-base-200/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Talents à la une</h2>
            <p className="opacity-60 max-w-xl mx-auto">
              Découvrez quelques membres passionnés prêts à partager leurs connaissances.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {profiles.map((profile) => (
                <div key={profile.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <figure className="px-4 pt-4 relative">
                    <div className="avatar">
                      <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        {profile.profilePicture ? (
                          <img src={profile.profilePicture} alt={profile.username} />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-neutral text-neutral-content text-2xl font-bold">
                            {profile.username.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </figure>
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">{profile.firstName}</h2>
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-2">@{profile.username}</p>

                    {/* Skills tags limités à 3 */}
                    <div className="flex flex-wrap gap-1 justify-center min-h-[3rem]">
                      {profile.skills && profile.skills.slice(0, 3).map(skill => (
                        <div key={skill.id} className="badge badge-outline badge-xs opacity-70">{skill.title}</div>
                      ))}
                      {profile.skills && profile.skills.length > 3 && (
                        <span className="text-xs opacity-50">+{profile.skills.length - 3}</span>
                      )}
                    </div>

                    <div className="card-actions mt-4 w-full">
                      <Link
                        href={`/profile/${profile.id}`}
                        className="btn btn-primary btn-sm btn-block"
                        onClick={handleProtectedClick}
                      >
                        {isAuthenticated ? "Voir le profil" : "Se connecter pour voir le profil"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>



    </div>
  );
}