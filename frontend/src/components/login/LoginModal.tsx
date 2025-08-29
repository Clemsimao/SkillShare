"use client";
import React, { useState } from "react";
import Link from "next/link";
import { login } from "@/integration/services/auth";
import type { LoginRequest } from "@/integration/types/api";

interface LoginModalProps {
  onLoginSuccess?: () => void;
}

export default function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur recommence à taper
    if (error) {
      setError(null);
    }
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

      // Validation email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Format d'email invalide");
        return;
      }

      // Appel direct au service d'authentification
      const response = await login(formData);
      
      if (response.token && response.user) {
        // Fermer la modale en cas de succès
        const modal = document.getElementById('login_modal') as HTMLDialogElement;
        modal?.close();
        
        // Reset du formulaire
        setFormData({ email: "", password: "" });
        setRememberMe(false);
        
        // Callback pour notifier le parent du succès
        onLoginSuccess?.();
        
        // Recharger la page pour mettre à jour l'état d'auth global
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      
      // Gestion des erreurs spécifiques
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else if (err.response?.status === 429) {
        setError("Trop de tentatives. Réessayez plus tard");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Erreur lors de la connexion. Vérifiez votre connexion internet");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    const modal = document.getElementById('login_modal') as HTMLDialogElement;
    modal?.close();
    // Reset du formulaire à la fermeture
    setFormData({ email: "", password: "" });
    setRememberMe(false);
    setError(null);
  };

  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box flex flex-col items-center justify-center gap-6 pb-16 max-w-md mx-auto">
        <form method="dialog">
          <button 
            type="button"
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4 w-full">
            <legend className="fieldset-legend text-xl">Connexion</legend>
            
            {/* Bouton Google (placeholder) */}
            <button 
              type="button" 
              className="btn bg-white text-black border-[#e5e5e5] w-full opacity-50 cursor-not-allowed"
              disabled
            >
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
              Login with Google (bientôt)
            </button>

            <div className="flex items-center w-full my-4">
              <div className="flex-grow border-t border-base-400"></div>
              <span className="fieldset-legend mx-4 text-sm text-base-content/70">
                OU
              </span>
              <div className="flex-grow border-t border-base-400"></div>
            </div>

            {/* Affichage des erreurs */}
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                placeholder="votre-email@exemple.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                minLength={3}
              />
            </div>

            <div className="form-control mt-4">
              <label className="label cursor-pointer">
                <span className="label-text">Se souvenir de moi</span>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox"
                  disabled={isLoading}
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-neutral mt-4 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </fieldset>
        </form>

        <div className="text-center">
          <div className="animate-bounce text-warning -rotate-2 text-sm font-black mb-2">
            Pas encore inscrit ?
          </div>
          <Link
            href="/signup"
            className="btn btn-accent"
            onClick={closeModal}
          >
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