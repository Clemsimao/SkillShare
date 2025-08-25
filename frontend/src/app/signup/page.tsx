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
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <label className="label-text font-bold">Pseudo <span className='text-sm text-accent'>*</span></label>
                  <input type="text" className="input italic opacity-50 input-bordered w-full md:w-64" placeholder="RingBearer1337" />
                </div>
              </div>

              <div className="form-control">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <label className="label-text font-bold">Email <span className='text-sm text-accent'>*</span></label>
                  <input type="text" className="input italic opacity-50 input-bordered w-full md:w-64" placeholder="FrodoBaggins@lotr.com" />
                </div>
              </div>

              <div className="form-control">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <label className="label-text">Prénom</label>
                  <input type="text" className="input italic opacity-50 input-bordered w-full md:w-64" placeholder="Frodo" />
                </div>
              </div>
              
              <div className="form-control">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <label className="label-text">Nom</label>
                  <input type="text" className="input italic opacity-50 input-bordered w-full md:w-64" placeholder="Baggins" />
                </div>
              </div>
              
              <div className="form-control">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <label className="label-text">Âge</label>
                  <input type="number" className="input italic opacity-50 input-bordered w-full md:w-64" placeholder="106" min="13" max="120" />
                </div>
              </div>
            </div>

            <div className="form-control">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <label className="label-text">Localisation</label>
                <input type="text" className="input italic opacity-50 input-bordered w-full md:w-64" placeholder="La Comté, Terres du milieu" />
              </div>
            </div>

              {/* --- Section libre about me --- */}
              <div className="form-control">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <label className="label-text md:pt-3">À propos de moi</label>
                  <textarea 
                    className="textarea italic opacity-50 textarea-bordered h-24 w-full md:w-64" 
                    placeholder="Parlez-nous de vous, vos passions, vos centres d'intérêts..."
                  ></textarea>
                </div>
              </div>
              
              {/* --- Section stats abo avec largeur fixe --- */}
              <div className="stats stats-horizontal shadow mt-8">
                <div className="stat text-center flex-1">
                  <div className="stat-value text-primary">233</div>
                  <div className="stat-desc px-4">Abonnés</div>
                </div>
                <div className="stat text-center flex-1">
                  <div className="stat-value text-primary">17</div>
                  <div className="stat-desc px-1">Abonnements</div>
                </div>
              </div>

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

      <div className="pb-4">
        <Footer />
      </div>
    </div>
  );
}