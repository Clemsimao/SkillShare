'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { register } from '@/integration/services/auth';
import type { RegisterRequest } from '@/integration/types/api';

export default function SignUpPage() {
  // États pour les données du formulaire
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    birthdate: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Gestion des changements d'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError(null);
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation basique
      if (!formData.email || !formData.password || !formData.username || 
          !formData.firstName || !formData.lastName || !formData.birthdate) {
        setError("Tous les champs sont requis");
        return;
      }

      // Appel au service d'inscription
      const response = await register(formData);
      
      if (response.token && response.user) {
        setSuccess(true);
        // Redirection après inscription
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (err: any) {
      console.error("Erreur inscription:", err);
      
      if (err.response?.status === 409) {
        setError("Cet email ou pseudo est déjà utilisé");
      } else if (err.response?.status === 400) {
        setError("Données invalides. Vérifiez vos informations");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Erreur lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Définition des champs du formulaire
  const formFields = [
    {
      name: 'username',
      label: 'Pseudo',
      type: 'text',
      placeholder: 'RingBearer1337',
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'FrodoBaggins@lotr.com',
      required: true
    },
    {
      name: 'password',
      label: 'Mot de passe',
      type: 'password',
      placeholder: '••••••••',
      required: true
    },
    {
      name: 'firstName',
      label: 'Prénom',
      type: 'text',
      placeholder: 'Frodo',
      required: true
    },
    {
      name: 'lastName',
      label: 'Nom',
      type: 'text',
      placeholder: 'Baggins',
      required: true
    },
    {
      name: 'birthdate',
      label: 'Date de naissance',
      type: 'date',
      placeholder: '',
      required: true
    }
  ];

  // Définition du type pour les champs du formulaire
  type FormField = {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
    min?: number;
    max?: number;
  };

  // Rendu d'un champ de formulaire
  const renderFormField = (field: FormField) => (
    <div key={field.name} className="form-control">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <label className={`label-text ${field.required ? 'font-bold' : ''}`}>
          {field.label}
          {field.required && <span className="text-sm text-accent ml-1">*</span>}
        </label>
        <input
          type={field.type}
          name={field.name}
          className="input italic opacity-50 input-bordered w-full md:w-78"
          placeholder={field.placeholder}
          value={formData[field.name as keyof RegisterRequest] || ''}
          onChange={handleInputChange}
          min={field.min}
          max={field.max}
          required={field.required}
          disabled={isLoading}
        />
      </div>
    </div>
  );

  // État de succès
  if (success) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="card bg-base-200 shadow-xl max-w-md">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-success">Compte créé !</h2>
            <p>Redirection vers l'accueil...</p>
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col px-4 pt-4">
      <main className="flex-1 flex items-center justify-center py-5">
        <div className="w-full max-w-2xl">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">

              <form onSubmit={handleSubmit}>
                {/* Affichage des erreurs */}
                {error && (
                  <div className="alert alert-error mb-4">
                    <span>{error}</span>
                  </div>
                )}

                {/* --- Section informations personnelles --- */}
                <div className="space-y-4">
                  {formFields.map(renderFormField)}
                </div>

                {/* --- Section libre about me --- */}
                <div className="form-control">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <label className="label-text md:pt-3">À propos de moi</label>
                    <textarea
                      className="textarea italic opacity-50 textarea-bordered h-24 w-full md:w-78"
                      placeholder="Parlez-nous de vous, vos passions, vos centres d'intérêts..."
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* --- Indication champs obligatoires --- */}
                <div className="text-sm italic text-accent mt-6">
                  * Champs obligatoires
                </div>

                {/* --- Section d'assaut brr brr nan je deconne c'est une simu des 2 boutons --- */}
                <div className="card-actions justify-end mt-6">
                  <button 
                    type="submit"
                    className="btn btn-neutral flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Création...
                      </>
                    ) : (
                      "Créer le compte"
                    )}
                  </button>
                  <button type="button" className="btn btn-outline btn-primary flex-1">
                    Éditer le profil
                  </button>
                </div>

                <div className="text-center mt-4">
                  <Link href="/" className="link link-primary">
                    Déjà un compte ? Se connecter
                  </Link>
                </div>

              </form>

            </div>
          </div>
        </div>
      </main>

    </div>
  );
}