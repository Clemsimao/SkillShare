
import Link from "next/link";

// Bloc abonnements / abonnées (boutons-compteurs)
export default function ProfileCounters({
  following,
  followers,
  followingHref,
  followersHref,
}: {
  following: number;              // nb d'abonnements
  followers: number;              // nb d'abonnés
  followingHref?: string;         // lien optionnel vers la liste des abonnements
  followersHref?: string;         // lien optionnel vers la liste des abonnées
}) {

  const FollowingTag = followingHref ? Link : "button";
  const FollowersTag = followersHref ? Link : "button";

  return (
    <section className="space-y-2">
      {/* Abonnements */}
      <FollowingTag
        {...(followingHref ? { href: followingHref } : {})}
        className="btn btn-outline w-full justify-between"
      >
        <span>Abonnements</span>
        <span className="badge">{following}</span>
      </FollowingTag>

      {/* Abonnées */}
      <FollowersTag
        {...(followersHref ? { href: followersHref } : {})}
        className="btn btn-outline w-full justify-between"
      >
        <span>Abonnées</span>
        <span className="badge">{followers}</span>
      </FollowersTag>
    </section>
  );
}
