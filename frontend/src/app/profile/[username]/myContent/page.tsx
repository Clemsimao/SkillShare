// app/profile/[username]/myContent/page.tsx
export default function MyContentPage() {
  return <div className="min-h-screen bg-base-100 p-4 sm:p-8">
      {/* En-tête de la page */}
      <div className="mb-8 flex justify-center">
        <h1 className="group group-hover:before:duration-500group-hover:after:duration-500 after:duration-500 hover:border-green-300 hover:before:[box-shadow:_20px_20px_20px_30px_cyan] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-center hover:scale-105 relative bg-base-200 h-16 w-64 border-base text-left p-3 text-base-500 font-bold font-schoolbell uppercase rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-blue-400 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-green-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
        Mes Rédactions
        </h1>
      </div>
      </div>
}
