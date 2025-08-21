'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LoginModal from './LoginModal'; // Ajuste le chemin si on restructure - Fab

export default function ColorTheme() {
  const [isDark, setIsDark] = useState(false);

  // (1/2) Cette fonction permet de basculer entre les thèmes "forest" et "retro" en modifiant l'attribut data-theme du document HTML et en stockant le thème sélectionné dans localStorage.
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'forest' : 'retro');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    setIsDark(initialTheme === 'forest');
  }, []);

  // (2/2) Même si le theme par défaut est déterminé par la préférence de l'utilisateur, il peut être "forcée" par le toggle.
  const toggleTheme = () => {
    const newTheme = !isDark ? 'forest' : 'retro';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <header className="w-full flex items-center justify-between mb-4">
      <LoginModal /> {/* Modale de connexion */}

      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo SkillShare"
          width={40}
          height={40}
          className="rounded"
        />
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
          SKILLSHARE
        </h1>
      </div>

      {/* Groupe d'éléments alignés à droite */}
      <div className="flex items-center gap-3">
        {/* -- Label "toggle" clair/sombre -- */}
        <label className="swap swap-rotate">
          <input 
            type="checkbox" 
            checked={isDark}
            onChange={toggleTheme}
          />
          {/* icone Soleil */}<svg
            className="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          {/* icone Lune */}<svg
            className="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>

        {/* -- Bouton d'ouverture de modale de connexion -- */}
        <button className="btn btn-circle" onClick={()=>document.getElementById('my_modal').showModal()}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
          </svg>
        </button>

        {/* -- Menu burger -- */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-circle">
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow"
          >
            <li><a>Profil</a></li>
            <li><a>Mes tutos</a></li>
            <li><a>Mes favoris</a></li>
            <li><a>Déconnexion</a></li>
          </ul>
        </div>
      </div>

    </header>
  );
}