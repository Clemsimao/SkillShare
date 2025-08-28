"use client";

import React, { useState } from "react";
import Link from "next/link";

// Import de vos services d'intégration
import { login } from "@/integration/services/auth";
import { useAuth } from "@/integration/hooks/use-auth";
import type { LoginRequest } from "@/integration/types/api";

export default function LoginModal() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utilisation de votre hook d'authentification
  const { login: authLogin, isLoggedIn, error: authError } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation basique
      if (!formData.email || !formData.password) {
        setError("Email et mot de passe requis");
        return;
      }

      // Utilisation de votre service d'authentification
      const success = await authLogin(formData);
      
      if (success) {
        // Fermer la modale en cas de succès
        const modal = document.getElementById('login_modal') as HTMLDialogElement;
        modal?.close();
        
        // Optionnel : redirection ou autre action
        console.log("Connexion réussie !");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box flex flex-col items-center justify-center gap-6 pb-16">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        
        <form onSubmit={handleSubmit} className="w-full">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend text-xl">Connexion</legend>
            
            <button type="button" className="btn bg-white text-black border-[#e5e5e5] w-full">
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Login with Google
            </button>

            <div className="flex items-center w-full my-4">
              <div className="flex-grow border-t border-base-400"></div>
              <span className="fieldset-legend mx-4 text-sm text-base-content/70">
                OU
              </span>
              <div className="flex-grow border-t border-base-400"></div>
            </div>

            {/* Affichage des erreurs */}
            {(error || authError) && (
              <div className="alert alert-error mb-4">
                <span>{error || authError}</span>
              </div>
            )}

            <label className="label">Email</label>
            <input 
              type="email" 
              name="email"
              className="input italic w-full" 
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              className="input italic w-full"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full er p-2 mt-4">
              <legend className="fieldset italic">Option de connexion</legend>
              <label className="label flex items-center justify-between w-full">
                <span className="legend">Se souvenir de moi...?</span>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="toggle"
                />
              </label>
            </fieldset>
            
            <button 
              type="submit" 
              className="btn btn-neutral mt-4 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Se connecter"
              )}
            </button>
          </fieldset>
        </form>

        <div className="tooltip tooltip-open tooltip-bottom" data-tip="hello">
          <div className="tooltip-content">
            <div className="animate-bounce text-yellow-400 -rotate-2 text-sm font-black">
              inscris-toi !
            </div>
          </div>

          <Link href="/signup" className="btn btn-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
            Créer un compte
          </Link>
        </div>
      </div>
    </dialog>
  );
}