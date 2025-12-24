"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { getExampleProfiles } from "@/integration/services/public";
import type { User } from "@/integration/types/api";

export default function Home() {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
            <Link href="/signup" className="btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform duration-200 group">
              Rejoindre la communauté
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="/search" className="btn btn-outline btn-lg backdrop-blur-sm hover:bg-base-content hover:text-base-100">
              Explorer les talents
            </Link>
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
                      <Link href={`/profile/${profile.id}`} className="btn btn-primary btn-sm btn-block">
                        Voir le profil
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* --- FOOTER --- */}
      <footer className="footer bg-neutral text-neutral-content p-10">
        <aside>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
            <span className="text-2xl font-bold">SkillShare</span>
          </div>
          <p>
            SkillShare Community.<br />
            Partagez sans compter depuis 2024.
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Social</h6>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
}