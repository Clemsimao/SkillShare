'use client';

import React, { useState } from 'react';

export default function FormContactModal() {
  // État du message de retour (succès/erreur)
  const [result, setResult] = useState('');

  // Gestion de l'envoi du formulaire de contact (Web3Forms)
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult('Envoi en cours...');

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Clé d'accès Web3Forms (⚠️ idéalement via variable d'environnement)
    formData.append('access_key', 'e324b25d-c9db-4397-9298-d73ed5089d64');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult('Merci pour votre message !\nJe vous répondrai dans les plus brefs délais.');
        form.reset();
      } else {
        console.error('Erreur Web3Forms', data);
        setResult(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      console.error('Network/Form error', err);
      setResult("Impossible d'envoyer le message. Veuillez réessayer.");
    }
  };

  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box flex flex-col items-center justify-center gap-6 pb-16">
        {/* Bouton de fermeture natif du <dialog> (conservé) */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full max-w-xl border p-4">
          <legend className="fieldset-legend text-xl">Contact</legend>

          {/* Formulaire de contact (sans animations) */}
          <form onSubmit={onSubmit} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Entrez votre nom"
                required
                className="input input-bordered bg-base-100"
              />

              <input
                type="email"
                name="email"
                placeholder="Entrez votre email"
                required
                className="input input-bordered bg-base-100"
              />
            </div>

            <textarea
              name="message"
              rows={6}
              placeholder="Entrez votre message"
              required
              className="textarea textarea-bordered w-full bg-base-100"
            />

            <button
              type="submit"
              className="btn btn-primary mt-4 mx-auto flex items-center gap-2"
            >
              Envoyer
            </button>

            {/* Affichage du résultat (succès/erreur) */}
            {result && (
              <p className="mt-3 text-center whitespace-pre-line text-sm opacity-80">{result}</p>
            )}
          </form>
        </fieldset>
      </div>
    </dialog>
  );
}