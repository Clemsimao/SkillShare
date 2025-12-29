// Fichier src/components/tutorials/TutorialForm.tsx
// Composant exécuter côté navig. (car gestion des fonctionalités interactives: events...)
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createTutorial, uploadTutorialImage } from "@/integration/services/tutorials";

const ACCENT = "#19362D";
// le type FormData définit les types de données attendus
type FormData = {
  title: string;
  category: string;
  description: string;
  mediaUrl: string;
  photoFile?: File | null;
  photoPreview?: string | null;
};

// Mock de données fictives
const CATEGORIES = [
  { value: "", label: "Catégorie" },
  { value: "dessin", label: "Dessin" },
  { value: "chant", label: "Chant" },
  { value: "ecriture", label: "Écriture" },
  { value: "musique", label: "Musique" },
  { value: "peinture", label: "Peinture" },
  { value: "photo", label: "Photographie" },
  { value: "sculpture", label: "Sculpture" },
];

// cette fonction définit l'état initial du formulaire
export default function TutorialForm() {
  const router = useRouter();
  const [data, setData] = useState<FormData>({
    title: "",
    category: "",
    description: "",
    mediaUrl: "",
    photoFile: null,
    photoPreview: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // --- handlers :  gestionnaires d'événements

  //  met à jour l'état du formulaire à chaque fois que l'utilisateur intéragit
  // lit la name est la value et maj l'obet data
  function onChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  // gère le téléchargement d'une photo par l'utilisateur
  // lit le 1er fichier [0], créé une url et maj l'état et l'aperçu
  function onPickPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setData((prev) => ({
      ...prev,
      photoFile: file,
      photoPreview: URL.createObjectURL(file),
    }));
  }

  // validate : vérifie que les champs obligatoires
  function validate(): string[] {
    const errs: string[] = [];
    if (!data.title.trim()) errs.push("Nom du tutoriel requis.");
    // if (!data.category) errs.push("Catégorie requise."); // Backend doesn't support category yet
    if (!data.description.trim()) errs.push("Description requise.");
    return errs;
  }

  // fonction  bouton "Enregistrer"
  function onSaveDraft(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (errs.length) return alert("Compléter: \n• " + errs.join("\n• "));
    console.log("[DRAFT]", data);
    alert("Brouillon enregistré (simulation).");
  }

  // fonction  bouton "Publier"
  async function onPublish(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (errs.length) return alert("Compléter: \n• " + errs.join("\n• "));

    setIsLoading(true);
    try {
      // 1. Création du tutoriel (texte)
      const response = await createTutorial({
        title: data.title,
        content: data.description, // Mapping description -> content
        videoLink: data.mediaUrl || undefined
        // Note: category is not supported by backend yet
      });

      if (response.success && response.tutorial) {
        // 2. Upload de l'image si présente
        if (data.photoFile) {
          await uploadTutorialImage(response.tutorial.id, data.photoFile);
        }

        // 3. Redirection
        // alert("Tutoriel publié avec succès !");
        router.push(`/tutorials/${response.tutorial.id}`);
      } else {
        alert("Erreur lors de la création : " + response.message);
      }
    } catch (error) {
      console.error("Erreur detailed:", error);
      alert("Une erreur est survenue lors de la publication.");
    } finally {
      setIsLoading(false);
    }
  }

  // --- UI: rendu principal du formulaire
  return (
    <form className="w-full max-w-xl mx-auto space-y-4">
      <h1 className="font-schoolbell text-xl font-bold text-cyan-500 md:text-xl">
        Créer un tutoriel
      </h1>

      <input
        name="title"
        value={data.title}
        onChange={onChange}
        type="text"
        placeholder="Titre du tutoriel"
        className="input input-bordered w-full border border-[#334155] rounded-lg"
        disabled={isLoading}
      />

      <select
        name="category"
        value={data.category}
        onChange={onChange}
        className="select select-bordered w-full border border-[#334155] rounded-lg"
        disabled={isLoading}
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value} disabled={c.value === ""}>
            {c.label}
          </option>
        ))}
      </select>

      <textarea
        name="description"
        value={data.description}
        onChange={onChange}
        placeholder="Descriptif / Contenu du tutoriel"
        className="textarea textarea-bordered w-full border border-[#334155] rounded-lg min-h-[150px]"
        disabled={isLoading}
      />

      <div className="bg-base-200 p-3 border border-[#334155] rounded-lg">
        {data.photoPreview ? (
          <img
            src={data.photoPreview}
            alt="Aperçu"
            className="w-full rounded-md mb-3"
          />
        ) : (
          <div className="placeholder bg-base-300 rounded-md w-16 h-16 flex items-center justify-center mb-3 border border-[#334155] rounded-lg">
            Image
          </div>
        )}
        <input type="file" accept="image/*" onChange={onPickPhoto} disabled={isLoading} />
      </div>

      <input
        name="mediaUrl"
        value={data.mediaUrl}
        onChange={onChange}
        type="url"
        placeholder="Lien de votre vidéo (optionnel)"
        className="input input-bordered w-full italic border border-[#334155] rounded-lg"
        disabled={isLoading}
      />

      <button
        onClick={onSaveDraft}
        className="btn w-full btn-dash btn-secondary"
        type="button"
        disabled={isLoading}
      >
        Enregistrer les modifications
      </button>
      <button
        onClick={onPublish}
        className="btn btn-outline btn-primary flex-1 w-full"
        style={{ backgroundColor: ACCENT }}
        type="button"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Publier"
        )}
      </button>
    </form>
  );
}
