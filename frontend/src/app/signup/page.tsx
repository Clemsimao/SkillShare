import React from 'react';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function SigninPage() {
  // Récupérez l'état de connexion depuis votre système d'auth
  // Exemples possibles :
  // const { user, isLoggedIn } = useAuth(); // Context
  // const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Redux
  // const { data: session } = useSession(); // NextAuth
  // const isLoggedIn = !!session;

    return (
    // Structure principale avec pour sticky footer en bas
    <div className="min-h-screen bg-base-100 flex flex-col px-4 pt-4">
      <Header />

      {/* Main content qui prend tout l'espace disponible */}
      <main className="flex-1 flex items-center justify-center py-5">
        <div className="w-full max-w-2xl">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
        
              {/* Section informations personnelles */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Prénom</span>
                </label>
                <input type="text" className="input italic opacity-50 input-bordered-" placeholder="Jean" />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nom</span>
                </label>
                <input type="text" className="input italic opacity-50 input-bordered" placeholder="Dupont" />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Âge</span>
                </label>
                <input type="number" className="input input-bordered" placeholder="25" min="13" max="120" />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Pseudo</span>
                </label>
                <input type="text" className="input input-bordered" placeholder="mon_pseudo" />
              </div>
            </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Localisation</span>
                </label>
                <input type="text" className="input input-bordered" placeholder="Paris, France" />
              </div>

              {/* Section libre about me */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">À propos de moi</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  placeholder="Parlez-nous de vous, vos passions, vos centres d'intérêts..."
                ></textarea>
              </div>

              {/* Section stats abo */}
              <div className="stats stats-horizontal shadow mt-4">
                <div className="stat">
                  <div className="stat-value text-primary">127</div>
                  <div className="stat-desc">Abonnés</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-primary">89</div>
                  <div className="stat-desc">Abonnements</div>
                </div>
              </div>

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