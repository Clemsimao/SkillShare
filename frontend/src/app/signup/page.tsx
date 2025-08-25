import React from 'react';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function SigninPage() {
  // Récupérez l'état de connexion depuis notr système d'auth
  // Exemples possibles de conditions - à check les back:
  // const { user, isLoggedIn } = useAuth(); // Context
  // const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Redux
  // const { data: session } = useSession(); // NextAuth
  // const isLoggedIn = !!session;

    return (
    <div className="min-h-screen bg-base-100 flex flex-col px-4 pt-4">
      <Header />

      {/* Main content qui prend tout l'espace dispo */}
      <main className="flex-1 flex items-center justify-center py-5">
        <div className="w-full max-w-2xl">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
        
              {/* --- Section informations personnelles --- */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label md:justify-between md:items-center">
                  <span className="label-text">Prénom</span>
                  <input type="text" className="input italic opacity-50 input-bordered w-full md:w-64 md:ml-4" placeholder="Jean" />
                </label>
              </div>
              
              <div className="form-control">
                <label className="label md:justify-between md:items-center">
                  <span className="label-text">Nom</span>
                  <input type="text" className="input italic opacity-50 input-bordered w-full md:w-64 md:ml-4" placeholder="Dupont" />
                </label>
              </div>
              
              <div className="form-control">
                <label className="label md:justify-between md:items-center">
                  <span className="label-text">Âge</span>
                  <input type="number" className="input italic opacity-50 input-bordered w-full md:w-64 md:ml-4" placeholder="25" min="13" max="120" />
                </label>
              </div>
              
              <div className="form-control">
                <label className="label md:justify-between md:items-center">
                  <span className="label-text">Pseudo</span>
                  <input type="text" className="input italic opacity-50 input-bordered w-full md:w-64 md:ml-4" placeholder="mon_pseudo" />
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label md:justify-between md:items-center">
                <span className="label-text">Localisation</span>
                <input type="text" className="input italic opacity-50 input-bordered w-full md:w-64 md:ml-4" placeholder="Paris, France" />
              </label>
            </div>

              {/* --- Section libre about me --- */}
              <div className="form-control">
                <label className="label md:justify-between md:items-start">
                  <span className="label-text md:pt-3">À propos de moi</span>
                  <textarea 
                    className="textarea italic opacity-50 textarea-bordered h-24 w-full md:w-64 md:ml-4" 
                    placeholder="Parlez-nous de vous, vos passions, vos centres d'intérêts..."
                  ></textarea>
                </label>
              </div>

              {/* --- Section stats abo avec largeur fixe --- */}
              <div className="stats stats-horizontal shadow mt-8">
                <div className="stat text-center flex-1">
                  <div className="stat-value text-primary">34</div>
                  <div className="stat-desc px-4">Abonnés</div>
                </div>
                <div className="stat text-center flex-1">
                  <div className="stat-value text-primary">12</div>
                  <div className="stat-desc px-1">Abonnements</div>
                </div>
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
                  <button className="btn btn-outline btn-primary w-full">Éditer le profil</button>
                )}
              </div> */}

            </div>
          </div>
        </div>
      </main>

      <div className="pb-4">
        <Footer />
      </div>
    </div>
  );
}