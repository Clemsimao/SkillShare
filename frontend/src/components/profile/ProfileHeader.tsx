// Avatar + pseudo + stats (tutos, abonnés, abonnements)
type Stats = { tutorials: number;  followers: number; following: number };

// ---------- Composant header du profil ----------
export default function ProfileHeader(props:  {
    name: string;
    username: string;
    avatarUrl?: string;
    location?: string;
    stats: Stats;
}) {
    const { name, username, avatarURL, location, stats } = props;

    // ---------- Rendu JSX ----------
    return (
  <section className="card bg-base-200 shadow-sm">
    <div className="card-body p-4">

      {/* --- Bloc Avatar + Infos utilisateur --- */}
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="w-16 rounded-full ring ring-base-300 ring-offset-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl ?? `https://api.dicebear.com/9.x/initials/svg?seed=${username}`}
              alt={`Avatar de ${name}`}
            />
          </div>
        </div>

        {/* --- Nom + Pseudo + Localisation --- */}
        <div className="min-w-0">
          <p className="font-poppins text-lg md:text-xl truncate">{name}</p>
          <p className="text-sm opacity-70">@{username}{location ? ` · ${location}` : ""}</p>
        </div>
      </div>

      {/* --- Bloc Statistiques utilisateur (tutos, abonnés, abonnements) --- */}
      <div className="stats stats-vertical md:stats-horizontal bg-transparent shadow-none mt-3">
        {/* --- Nombre de tutos --- */}
        <div className="stat">
          <div className="stat-title">Tutos</div>
          <div className="stat-value text-lg">{stats.tutorials}</div>
        </div>

        {/* --- Nombre d’abonnés --- */}
        <div className="stat">
          <div className="stat-title">Abonnés</div>
          <div className="stat-value text-lg">{stats.followers}</div>
        </div>

        {/* --- Nombre d’abonnements --- */}
        <div className="stat">
          <div className="stat-title">Abonnements</div>
          <div className="stat-value text-lg">{stats.following}</div>
        </div>
      </div>

    </div>
  </section>
);
}