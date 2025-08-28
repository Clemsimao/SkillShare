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
      <div className="border-l-1 border-cyan-700 p-5">
        <div className="flex items-center justify-between pl-2">
          <h2 className="font-schoolbell text-xl font-bold pb-3 text-cyan-500 md:text-xl">
            About me…
          </h2>
        </div>

        <p className="text-base leading-loose font-schoolbell pl-2">{about}</p>
      </div>
    </section>
  );
}
