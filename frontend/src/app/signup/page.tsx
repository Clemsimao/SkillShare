"use client";

import React, { useState } from 'react';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthdate: '',
    location: '', // Pas utilisé par le backend pour l'instant au register
    bio: ''       // Pas utilisé par le backend pour l'instant au register
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Définition des champs du formulaire
  const formFields = [
    {
      name: 'username',
      label: 'Pseudo (Username)',
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
      name: 'confirmPassword',
      label: 'Confirmer le mot de passe',
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
      required: true,
    },
    {
      name: 'location',
      label: 'Localisation',
      type: 'text',
      placeholder: 'La Comté, Terres du Milieu',
      required: false
    }
  ];

  type FormField = {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
    min?: number;
    max?: number;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    // Validation basique
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName || !formData.birthdate) {
      setError("Veuillez remplir tous les champs obligatoires (*)");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthdate: formData.birthdate,
        location: formData.location,
        content: formData.bio
      });
      // Redirection après succès sur la home ou profile
      router.push('/');
    } catch (err: any) {
      console.error("Erreur inscription:", err);
      // L'erreur est gérée par le context mais on l'affiche ici localement si besoin
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

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
          value={(formData as any)[field.name]}
          onChange={handleInputChange}
          className="input italic opacity-50 input-bordered w-full md:w-78"
          placeholder={field.placeholder}
          required={field.required}
        />
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-base-100 flex flex-col px-4 pt-4">
      <main className="flex-1 flex items-center justify-center py-5">
        <div className="w-full max-w-2xl">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">

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
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="textarea italic opacity-50 textarea-bordered h-24 w-full md:w-78"
                    placeholder="Parlez-nous de vous, vos passions, vos centres d'intérêts..."
                  />
                </div>
              </div>



              {/* --- Indication champs obligatoires --- */}
              <div className="text-sm italic text-accent mt-6">
                * Champs obligatoires
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  className="btn btn-neutral flex-1"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Création..." : "Créer le compte"}
                </button>
                {/* Bouton éditer profil désactivé ou caché en mode création */}
                {/* <button className="btn btn-outline btn-primary flex-1" disabled>Éditer le profil</button> */}
              </div>

            </div>
          </div>
        </div>
      </main>

    </div>
  );
}