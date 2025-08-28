// Fichier username/page.tsx
import Link from "next/link";

// ---------- Sections réutilisables (pour le composant profil) ----------
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoList from "@/components/profile/ProfileInfoList";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfileFavourites from "@/components/profile/ProfileFavourites";
import ProfileCounters from "@/components/profile/ProfileCounters";

type PageProps = {
  params: {
    username: string;
  };
};

// ---------- Composant parent (page profil) ----------
export default async function ProfilePage({ params }: PageProps) {
  const { username } = params;

  // TODO: récupérer les données par l'appel API (via src/lib/api-client.ts = connexion front > back)
  const user = {
    username: "M.Dup",
    name: "Mathieu Dupond",
    avatarURL: undefined as string | undefined,
    location: "Lyon, France",
    stats: { tutorials: 8, followers: 51, following: 12 },
    about:
      "Artiste et formateur passionné par l’illustration et la photo. Je met à votre disposition mes compétences et mon expérience. Je peux vous aider à apprendre les bases de la photographie et de rendre jolis vos souvenirs les plus inoubliables. La photo c'est la vie",
    favorites: [
      { id: "t1", title: "Tuto 1" },
      { id: "t2", title: "Tuto 2" },
      { id: "t3", title: "Tuto 3" },
    ],
    info: {
      fullname: "Mathieu Dupond",
      age: 37,
      gender: "Homme",
      city: "Lyon",
    },
  };

  return (
    <main className="mx-auto max-w-[1100px] p-4 md:p-6 lg:p-8">
      <div className="flex justify-center mb-6">
        <h1 className="group group-hover:before:duration-500group-hover:after:duration-500 after:duration-500 hover:border-green-300 hover:before:[box-shadow:_20px_20px_20px_30px_cyan] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-center hover:scale-105 relative bg-base-200 h-16 w-64 border-base text-left p-3 text-base-500 font-bold font-schoolbell uppercase rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-blue-400 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-green-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
          Mon Profil
        </h1>
      </div>

      {/* Layout mobile → 2 colonnes à partir de md */}
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Colonne gauche */}
        <div className="space-y-7">
          <ProfileHeader
            username={user.username}
            avatarUrl={user.avatarUrl}
            stats={user.stats}
          />

          <ProfileInfoList
            fullname={user.info.fullname}
            age={user.info.age}
            gender={user.info.gender}
            city={user.info.city}
          />

          <Link
            href={`/signup`}
            className="btn btn-outline btn-primary flex-1 w-full"
          >
            Éditer profil
          </Link>
        </div>

        {/* Colonne droite (2 colonnes: haut / bas) */}
        <div className="space-y-3 bg-base-200 rounded-lg p-10">
          <ProfileAbout username={user.username} about={user.about} />

          <ProfileFavourites username={user.username} items={user.favorites} />
        </div>
      </div>
    </main>
  );
}
