import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
// Inserer Header et footer

// Avatar + pseudo + stats (tutos, abonnés, abonnements)
type Stats = { tutorials: number; followers: number; following: number };

// ---------- Composant header du profil ----------
export default function ProfileHeader(props: {
  name: string;
  username: string;
  avatarUrl?: string;
  location?: string;
  stats: Stats;
}) {
  const { name, username, avatarUrl, location, stats } = props;

  // ---------- Rendu JSX ----------
  return (
    <section className="card bg-cyan-700 pt-3 pb-3 shadow-xl shadow-cyan-500/25 rounded-lg">
      <div className="card-body">
        {/* --- Bloc Avatar + Infos utilisateur --- */}
        <div className="flex items-center gap-5">
          <div className="avatar">
            <div className="w-16 rounded-full ring ring-base-300 ring-offset-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  avatarUrl ??
                  `https://api.dicebear.com/9.x/initials/svg?seed=${username}`
                }
                alt={`Avatar de ${name}`}
              />
            </div>
          </div>

          {/* --- Nom + Pseudo + Localisation --- */}
          <div className="min-w-0">
            <p className="font-poppins text-lg md:text-xl truncate text-white">
              {name}
            </p>
            <p className="text-lg text-white font-bold">
              @{username}
              {location ? ` · ${location}` : ""}
            </p>
          </div>
        </div>

        {/* --- Bloc Statistiques utilisateur (version DaisyUI optimisée) --- */}
        <div className="stats bg-transparent shadow-none mt-2 w-full">
          <div className="grid grid-cols-3 w-full sm:w-60">
            {/* --- Nombre de tutos --- */}
            <div className="stat place-items-center p-2">
              <div className="text-white stat-title text-xs">Tutos</div>
              <div className="stat-value text-lg text-white">
                {stats.tutorials}
              </div>
            </div>

            {/* --- Nombre d'abonnés --- */}
            <div className="stat place-items-center p-2">
              <div className="text-white stat-title text-xs">Abonnés</div>
              <div className="stat-value text-lg text-white">
                {stats.followers}
              </div>
            </div>

            {/* --- Nombre d'abonnements --- */}
            <div className="stat place-items-center p-2">
              <div className="text-white stat-title text-xs">Abonnements</div>
              <div className="stat-value text-lg text-white">
                {stats.following}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
