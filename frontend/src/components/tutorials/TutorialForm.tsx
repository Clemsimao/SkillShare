// Fichier src/components/tutorials/TutorialForm.tsx
// ce composant est exécuter côté navigateur (car usage des onChange, onClick...)
"use client";

import { useState, ChangeEvent, FormEvent } from "react";

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
  const [data, setData] = useState<FormData>({
    title: "",
    category: "",
    description: "",
    mediaUrl: "",
    photoFile: null,
    photoPreview: null,
  });

  // --- handlers :  gestionnaires d'événements 

  //  met à jour l'état du formulaire à chaque fois que l'utilisateur intéragit
  // lit la name est la value et maj l'obet data
  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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
    if (!data.category) errs.push("Catégorie requise.");
    if (!data.description.trim()) errs.push("Description requise.");
    return errs;
  }

  // fonction  bouton "Enregistrer"
  function onSaveDraft(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (errs.length) return alert("Compléter: \n• " + errs.join("\n• "));
    console.log("[DRAFT]", data);
    alert("Brouillon enregistré.");
  }

  // fonction  bouton "Publier"
  function onPublish(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (errs.length) return alert("Compléter: \n• " + errs.join("\n• "));
    console.log("[PUBLISH]", data);
    alert("Tutoriel publié (MVP).");
  }

  // --- UI: rendu principal du formulaire 
  return (
    <form className="w-full max-w-xl mx-auto space-y-4">
      <h1 className="text-center text-xl font-semibold" style={{ color: ACCENT }}>
        Création de tutoriel
      </h1>

      <input
        name="title"
        value={data.title}
        onChange={onChange}
        type="text"
        placeholder="Nom du tutoriel"
        className="input input-bordered w-full"
      />

      <select
        name="category"
        value={data.category}
        onChange={onChange}
        className="select select-bordered w-full"
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
        placeholder="Descriptif"
        className="textarea textarea-bordered w-full"
      />

      <div className="bg-base-200 p-3 rounded-lg">
        {data.photoPreview ? (
          <img src={data.photoPreview} alt="Aperçu" className="w-full rounded-md mb-3" />
        ) : (
          <div className="placeholder bg-base-300 rounded-md w-16 h-16 flex items-center justify-center mb-3">
            IMG
          </div>
        )}
        <input type="file" accept="image/*" onChange={onPickPhoto} />
      </div>

      <input
        name="mediaUrl"
        value={data.mediaUrl}
        onChange={onChange}
        type="url"
        placeholder="Lien de votre vidéo"
        className="input input-bordered w-full italic"
      />

      <button onClick={onSaveDraft} className="btn w-full" type="button">
        Enregistrer les modifications
      </button>
      <button
        onClick={onPublish}
        className="btn w-full text-white"
        style={{ backgroundColor: ACCENT }}
        type="button"
      >
        Publier
      </button>
    </form>
  );
}
