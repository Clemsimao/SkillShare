
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
<section className="card bg-base-200 rounded-lg">
  <div className="card-body p-10 border border-[#334155] rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-schoolbell text-xl font-bold text-cyan-500 md:text-xl">About me…</h2>
        </div>

        <p className="text-base leading-relaxed font-schoolbell">
          {about}
        </p>
      </div>
    </section>
  );
}
