import React from 'react';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
// import { useSession } from "next-auth/react";

export default function SignUpPage() {
  // Récupérez l'état de connexion depuis notr système d'auth
  // Exemples possibles de conditions - à check les back:
  // const { user, isLoggedIn } = useAuth(); // Context
  // const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Redux
  // const { data: session } = useSession(); // NextAuth
  // const isLoggedIn = !!session;

  // Définition des champs du formulaire
  const formFields = [
    {
      name: 'pseudo',
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
      name: 'prenom',
      label: 'Prénom',
      type: 'text',
      placeholder: 'Frodo',
      required: false
    },
    {
      name: 'nom',
      label: 'Nom',
      type: 'text',
      placeholder: 'Baggins',
      required: false
    },
    {
      name: 'age',
      label: 'Âge',
      type: 'number',
      placeholder: '106',
      required: false,
      min: 13,
      max: 120
    },
    {
      name: 'localisation',
      label: 'Localisation',
      type: 'text',
      placeholder: 'La Comté, Terres du Milieu',
      required: false
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
          className="input italic opacity-50 input-bordered w-full md:w-78"
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
        />
      </div>
    </div>
  );

  // Section statistiques
  const renderStats = () => (
    <div className="stats stats-horizontal shadow mt-8">
      <div className="stat text-center flex-1">
        <div className="stat-value text-primary">233</div>
        <div className="stat-desc px-4">Abonnés</div>
      </div>
      <div className="stat text-center flex-1">
        <div className="stat-value text-primary">174</div>
        <div className="stat-desc px-1">Abonnements</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 flex flex-col px-4 pt-4">
      <main className="flex-1 flex items-center justify-center py-5">
        <div className="w-full max-w-2xl">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">

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
                  />
                </div>
              </div>

              {/* --- Section stats abo avec largeur fixe --- */}
              {renderStats()}

              {/* --- Indication champs obligatoires --- */}
              <div className="text-sm italic text-accent mt-6">
                * Champs obligatoires
              </div>

              {/* --- Section d'assaut brr brr nan je deconne c'est une simu des 2 boutons --- */}
              <div className="card-actions justify-end mt-6">
                <button className="btn btn-neutral flex-1">Créer le compte</button>
                <button className="btn btn-outline btn-primary flex-1">Éditer le profil</button>
              </div>

              {/* Bouton conditionnel */}
              {/* <div className="card-actions justify-end mt-6">
                {!isLoggedIn ? (
                  <button className="btn btn-neutral w-full">Créer le compte</button>
                ) : (
                  <button className="btn btn-outline btn-primary flex-1">Éditer le profil</button>
                )}
              </div> */}

            </div>
          </div>
        </div>
      </main>

    </div>
  );
}