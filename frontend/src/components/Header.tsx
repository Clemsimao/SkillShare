import React from 'react';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button className="btn btn-outline btn-sm">Logo</button>
        <h1 className="text-lg font-bold">SkillShare</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* button pour le login / sign up */}
        <button className="btn btn-outline btn-accent btn-sm">Connexion</button>

        {/* Dropdown menu burger */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1 p-2">
            <svg
              className="swap-off fill-current"
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