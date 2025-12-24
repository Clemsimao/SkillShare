"use client";

import React, { useState } from "react";
import Link from "next/link";
// import { login } from "@/integration/services/auth"; // REMOVED
import { useAuth } from "@/context/AuthProvider";
import { LoginRequest } from "@/integration/types/api";

export default function LoginModal() {
  const { login } = useAuth(); // Utilisation du contexte

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData);

      // Fermer la modale
      const modal = document.getElementById('login_modal') as HTMLDialogElement;
      modal?.close();

      // Reset form
      setFormData({ email: "", password: "" });
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      // L'erreur est déjà gérée dans le contexte, mais on peut l'afficher ici si besoin
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
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

            <button
              type="submit"
              className="btn btn-neutral mt-4 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm">Pas encore de compte ?</p>
              <Link
                href="/signup"
                className="link link-primary text-sm"
                onClick={() => {
                  const modal = document.getElementById('login_modal') as HTMLDialogElement;
                  modal?.close();
                }}
              >
                Créer un compte
              </Link>
            </div>

          </fieldset>
        </form>
      </div>
    </dialog>
  );
}