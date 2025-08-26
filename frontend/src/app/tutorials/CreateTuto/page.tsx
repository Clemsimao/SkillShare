// Page /tutorials/new : écran de création  
// Afficher simplement le formulaire réutilisable.

import TutorialForm from "@/components/tutorials/TutorialForm";

// Fonction du composant qui sert à créer un tuto
export default function NewTutorialPage() {
//  { Rendu principal du formulaire de création tuto }
  return (
    <main className="min-h-screen bg-base-100 px-4 py-6 flex flex-col items-center">
      <TutorialForm />
    </main>
  );
}
