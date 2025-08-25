import React from 'react';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";


export default function SigninPage() {
  return (
    <main className="min-h-screen bg-base-100 flex flex-col items-center justify-between px-4 pt-4 pb-5">
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="modal-box flex flex-col items-center justify-center gap-6">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <label className="label">Nom</label>
            <input type="text" className="input input-bordered w-full" placeholder="Jean Dupont" />

            <label className="label">Email</label>
            <input type="email" className="input input-bordered w-full" placeholder="email@example.com" />

            <label className="label">Mot de passe</label>
            <input type="password" className="input input-bordered w-full" placeholder="********" />

            <button className="btn btn-neutral mt-4 w-full">Créer le compte</button>
          </fieldset>
        </div>
      </div>
      <Footer />
    </main>
  );
}
