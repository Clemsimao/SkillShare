
import Link from "next/link";

// composant "ABout me"
export default function ProfileAbout({
  username,
  about,
  showEditLink = true, 
}: {
  username: string;
  about: string;
  showEditLink?: boolean;
}) {


  return (
    <section className="card bg-base-200">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-poppins text-xl md:text-2xl">About me…</h2>
          {/*Le lien "Éditer" est affiché uniquement si la variable `showEditLink` est "true"
          pour des raisons de sécurité pour vérifier que c'est le bon utilisateur qui modifie ses infos*/}
          {showEditLink && (
            <Link
              href={`/profile/${username}/about`}
              className="link link-hover text-sm"
            >
              Éditer
            </Link>
          )}
        </div>

        <p className="font-inter text-base leading-relaxed">
          {about}
        </p>
      </div>
    </section>
  );
}
