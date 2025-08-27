'use client';

import React, { useState } from 'react';

export default function FormContactModal() {
  const [result, setResult] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult('Envoi en cours...');

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append('access_key', 'e324b25d-c9db-4397-9298-d73ed5089d64');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult('Merci pour votre message !\nNous vous répondrons dans les plus brefs délais.');
        form.reset();
      } else {
        setResult(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setResult("Impossible d'envoyer le message. Veuillez réessayer.");
    }
  };

  return (
    <dialog id="formcontact_modal" className="modal flex items-center justify-center">
      <div className="modal-box flex flex-col items-center justify-center gap-6 pb-16 relative">
        {/* Bouton de fermeture identique au LoginModal, placé directement dans modal-box */}
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-base-content/70 hover:text-base-content"
            aria-label="Fermer"
          >
            ✕
          </button>
        </form>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend text-xl">Contact</legend>
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-2">
            <label className="label text-base-content" htmlFor="contact-name">Nom</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Nom"
              required
              className="input input-bordered italic bg-base-100 text-base-content placeholder:text-base-content/70"
            />
            <label className="label text-base-content" htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="Email"
              required
              className="input input-bordered italic bg-base-100 text-base-content placeholder:text-base-content/70"
            />
            <label className="label text-base-content" htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              placeholder="Votre message..."
              required
              className="textarea textarea-bordered italic w-full bg-base-100 text-base-content placeholder:text-base-content/70"
            />
            <button type="submit" className="btn btn-neutral mt-4">Envoyer</button>
            {result && (
              <p className="mt-3 text-center whitespace-pre-line text-sm opacity-80">{result}</p>
            )}
          </form>
        </fieldset>
      </div>
    </dialog>
  );
}