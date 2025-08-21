// Fichier username/page.tsx
import Link from "next/link";

// ---------- Sections réutilisables (profil) ----------
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoList from "@/components/profile/ProfileInfoList";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfileFavorites from "@/components/profile/ProfileFavorites";
import ProfileCounters from "@/components/profile/ProfileCounters";

type PageProps = { params: { username: string } };

// ---------- Composant parent (page profil) ----------
export default async function ProfilePage( { params }: PageProps) {
    const { username } = params; 

    // TODO: récupérer les données par l'appel API (via src/lib/api-client.ts)
    const user = {
        name: "Joe Jackson",
        avatarURL: undefined as string | undefined,
        location: "Paris",
        stats: { tutorials: 8, followers: 51, foloowing: 12 },
        about:
            "Artiste et formatrice passionnée par l’illustration et la photo.",
        favorites: [{ id: "t1", title: "Tuto 1" }, { id: "t2", title: "Tuto 2" }, { id: "t3", title: "Tuto 3" }],
        info: { fullname: "Amina Benali", age: 26, gender: "Femme", city: "Paris" },
    };

    return (
        <main className="mx-auto max-w-md p-4 md:max-w-3xl">
            <h1 className="font-poppins text-2xl md:text-3xl mb-3">Mon profil</h1>

            {/* Layout mobile → 2 colonnes à partir de md */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Colonne gauche */}
                <div className="space-y-3">
                    <ProfileHeader
                        name={user.name}
                        username={user.username}
                        avatarUrl={user.avatarUrl}
                        location={user.location}
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
                        className="btn btn-outline w-full"
                    >
                        Edit profil
                    </Link>

                    <ProfileCounters
                        followers={user.stats.followers}
                        following={user.stats.following}
                    />
                </div>

                {/* Colonne droite (2 colonnes: haut / bas) */}
                <div className="md:col-span-2 space-y-3">
                    <ProfileAbout
                        username={user.username}
                        about={user.about}
                    />

                    <ProfileFavorites
                        username={user.username}
                        items={user.favorites}
                    />
                </div>
            </div>
        </main>
    );
}