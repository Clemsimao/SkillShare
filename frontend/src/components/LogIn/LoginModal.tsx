'use client';

import React from 'react';
import Link from 'next/link';

export default function LoginModal() {
  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box flex flex-col items-center justify-center gap-6 pb-16">
        {/* Bouton fermer - HORS du form */}
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            const dialog = document.getElementById('login_modal') as HTMLDialogElement;
            dialog?.close();
          }}
        >
          ✕
        </button>
        
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend text-xl">Connexion</legend>
          
          {/* Contenu de connexion... */}
          <button className="btn bg-white text-black border-[#e5e5e5]">
            {/* SVG Google */}
            Login with Google
          </button>

          <div className="flex items-center w-full my-4">
            <div className="flex-grow border-t border-base-400"></div>
            <span className="fieldset-legend mx-4 text-sm text-base-content/70">OU</span>
            <div className="flex-grow border-t border-base-400"></div>
          </div>

          <label className="label">Email</label>
          <input type="email" className="input italic" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" className="input italic" placeholder="Password" />
          
          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full p-2">
            <legend className="fieldset italic">Option de connexion</legend>
            <label className="label flex items-center justify-between w-full">
              <span className='legend'>Se souvenir de moi...?</span>
              <input type="checkbox" defaultChecked={false} className="toggle" />
            </label>
          </fieldset>
          
          <button className="btn btn-neutral mt-4">Se connecter</button>
        </fieldset>
        
        {/* Lien inscription - HORS du form */}
        <div className="tooltip tooltip-open tooltip-bottom" data-tip="hello">
          <div className="tooltip-content">
            <div className="animate-bounce text-yellow-400 -rotate-2 text-sm font-black">inscris-toi !</div>
          </div>
          
          <Link
            href="/signup"
            className="btn btn-accent"
            onClick={() => {
              const dialog = document.getElementById('login_modal') as HTMLDialogElement;
              dialog?.close(); // Ferme la modale avant la navigation
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
            Créer un compte
          </Link>
        </div>
      </div>
    </dialog>
  );
}