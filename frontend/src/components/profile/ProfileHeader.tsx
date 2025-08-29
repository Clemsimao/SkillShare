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
      
    <div className="card-body p-0">

<div
  className="relative overflow-hidden w-full h-80 rounded-3xl cursor-pointer text-2xl font-bold bg-gradient-to-tr from-cyan-500 via-cyan-600 to-teal-600"
>
  <div className="z-10 absolute w-full h-full peer"></div>
  <div
    className="absolute border-4 border-color-white peer-hover:-top-20 peer-hover:-left-16 peer-hover:w-[140%] peer-hover:h-[140%] -top-28 -left-16 w-32 h-44 rounded-full bg-emerald-500 transition-all duration-500"
  >
    
  </div>
  <div
    className="absolute flex text-xl text-center items-end justify-end peer-hover:right-0 peer-hover:rounded-b-none peer-hover:bottom-0 peer-hover:items-center peer-hover:justify-center peer-hover:w-full peer-hover:h-full -bottom-32 -right-16 w-36 h-44 rounded-full bg-emerald-500 transition-all duration-500 opacity-0 peer-hover:opacity-100"
  >
      <div className="stats bg-transparent shadow-none mt-2 w-full">
        <div className="grid grid-cols-1 w-full">

          {/* --- Nombre de tutos --- */}
          <div className="stat place-items-center p-2">
            <div className="text-white stat-title text-xl">Tutoriels</div>
            <div className="stat-value text-lg text-white">{stats.tutorials}</div>
          </div>
  
            {/* --- Nombre d'abonnés --- */}
            <div className="stat place-items-center p-2">
              <div className="text-white stat-title text-xl">Abonnés</div>
              <div className="stat-value text-lg text-white">
                {stats.followers}
              </div>
            </div>

          {/* --- Nombre d'abonnements --- */}
          <div className="stat place-items-center p-2">
            <div className="text-white stat-title text-xl">Abonnements</div>
            <div className="stat-value text-lg text-white">{stats.following}</div>
          </div>
        </div>
      </div>
  </div>

  {/* --- Bloc Avatar + Infos utilisateur centré --- */}
  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none peer-hover:opacity-0 transition-opacity duration-500">
    <div className="avatar mb-3">
      <div className="w-20 rounded-full ring ring-white ring-offset-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl ?? `https://api.dicebear.com/9.x/initials/svg?seed=${username}`}
          alt={`Avatar de ${name}`}
        />
      </div>
    </div>
    
    <div className="text-center">
      <p className="font-poppins text-lg md:text-xl text-white font-semibold">{name}</p>
      <p className="text-base text-white/90">@{username}</p>
      {location && <p className="text-sm text-white/80 mt-1">{location}</p>}
    </div>
  </div>
</div>

</div>
);
}

