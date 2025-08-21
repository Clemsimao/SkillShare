'use client';

import React from 'react';

export default function SigninModal() {
  return (
    <dialog id="my_modal" className="modal">
      <div className="modal-box flex flex-col items-center justify-center gap-6">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend text-xl">Connexion</legend>
          <label className="label">Email</label>
          <input type="email" className="input italic" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" className="input italic" placeholder="Password" />
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full er p-2">
          <legend className="fieldset italic">Option de connexion</legend>
          <label className="label flex items-center justify-between w-full">
            <span className='legend'>Se souvenir de moi...?</span>
            <input type="checkbox" defaultChecked className="toggle" />
          </label>
        </fieldset>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
      </div>
    </dialog>
  )
}