import { User } from "@/integration/types/api";
import Link from "next/link";
import { UserCircle } from "lucide-react";

interface UserResultsProps {
    users: User[];
}

export default function UserResults({ users }: UserResultsProps) {
    if (users.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">Aucun expert trouvé pour cette recherche.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
                <Link
                    href={`/profile/${user.id}`}
                    key={user.id}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                >
                    <div className="card-body items-center text-center">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                {user.profilePicture ? (
                                    <img src={user.profilePicture} alt={user.username} />
                                ) : (
                                    <div className="w-full h-full bg-base-300 flex items-center justify-center">
                                        <UserCircle className="w-12 h-12 text-base-content/50" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <h2 className="card-title">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                        <p className="line-clamp-2 text-sm mt-2">{user.content || "Pas de bio renseignée"}</p>

                        <div className="flex flex-wrap justify-center gap-1 mt-3">
                            {user.skills?.slice(0, 3).map(skill => (
                                <span key={skill.id} className="badge badge-outline badge-sm">{skill.title}</span>
                            ))}
                            {(user.skills?.length || 0) > 3 && (
                                <span className="badge badge-ghost badge-sm">+{user.skills!.length - 3}</span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
