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
        username: string }
};

// ---------- Composant parent (page profil) ----------
export default async function ProfilePage( { params }: PageProps) {
    const { username } = params; 

    // TODO: récupérer les données par l'appel API (via src/lib/api-client.ts = connexion front > back)
    const user = {
        username: "M.Dup",
        name: "Mathieu Dupond",
        avatarURL: undefined as string | undefined,
        location: "Lyon, France",
        stats: { tutorials: 8, followers: 51, following: 12 },
        about:
            "Artiste et formateur passionné par l’illustration et la photo.",
        favorites: [{ id: "t1", title: "Tuto 1" }, { id: "t2", title: "Tuto 2" }, { id: "t3", title: "Tuto 3" }],
        info: { fullname: "Mathieu Dupond", age: 37, gender: "Homme", city: "Lyon" },
    };

    return (
        <main className="mx-auto max-w-[1100px] p-4 md:p-6 lg:p-8">
            <h1 className="font-poppins text-2xl md:text-3xl mb-4 text-center md:text-left">Mon profil</h1>

            {/* Layout mobile → 2 colonnes à partir de md */}
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">

                {/* Colonne gauche */}
                <div className="space-y-3">
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
                        href={`/profile/${username}/about`}
                        className="btn w-full text-white 
                                    dark:bg-[#19362D] dark:hover:bg-[#145242] 
                                    dark:border-none"
                    >
                        Éditer profil
                    </Link>

                                 </div>

                {/* Colonne droite (2 colonnes: haut / bas) */}
                <div className="md:col-span-1 md:col-start-2 space-y-4">
                    <ProfileAbout
                        username={user.username}
                        about={user.about}
                    />

                    <ProfileFavourites
                        username={user.username}
                        items={user.favorites}
                    />
                </div>
            </div>
        </main>
    );
}