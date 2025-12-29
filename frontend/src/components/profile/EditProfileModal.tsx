"use client";

import React, { useState, useEffect } from "react";
import { User, Skill, UpdateUserData } from "@/integration/types/api";
import {
    updateProfile,
    uploadProfilePicture,
    addUserSkill,
    removeUserSkill,
    addUserInterest,
    removeUserInterest,
} from "@/integration/services/user";
import { getSkills } from "@/integration/services/public";
import { X, Upload, Save, Plus, Trash2 } from "lucide-react";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onUpdate: () => void;
}

type Tab = "info" | "skills" | "interests";

export default function EditProfileModal({
    isOpen,
    onClose,
    user,
    onUpdate,
}: EditProfileModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>("info");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State for Info
    const [formData, setFormData] = useState<UpdateUserData>({
        firstName: user.firstName,
        lastName: user.lastName,
        content: user.content || "",
        location: user.location || "",
        gender: user.gender,
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.profilePicture || null
    );

    // Skills State
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const [selectedSkillId, setSelectedSkillId] = useState<string>("");
    const [selectedInterestId, setSelectedInterestId] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            loadSkills();
            // Reset form data on open
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                content: user.content || "",
                location: user.location || "",
                gender: user.gender,
            });
            setAvatarPreview(user.profilePicture || null);
            setAvatarFile(null);
            setError(null);
        }
    }, [isOpen, user]);

    const loadSkills = async () => {
        try {
            const response = await getSkills();
            if (response.success) {
                setAvailableSkills(response.skills);
            }
        } catch (err) {
            console.error("Failed to load skills", err);
            setError("Impossible de charger la liste des compétences.");
        }
    };

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Update Text Info
            await updateProfile(formData);

            // 2. Update Avatar if selected
            if (avatarFile) {
                await uploadProfilePicture(avatarFile);
            }

            onUpdate();
            onClose();
        } catch (err: any) {
            console.error("Update failed", err);
            setError(err.message || "Une erreur est survenue lors de la mise à jour.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleAddSkill = async () => {
        if (!selectedSkillId) return;
        setIsLoading(true);
        try {
            await addUserSkill(Number(selectedSkillId));
            onUpdate(); // Refresh parent to show new skill
            setSelectedSkillId("");
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'ajout de la compétence.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveSkill = async (skillId: number) => {
        if (!confirm("Voulez-vous vraiment retirer cette compétence ?")) return;
        setIsLoading(true);
        try {
            await removeUserSkill(skillId);
            onUpdate();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la suppression de la compétence.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddInterest = async () => {
        if (!selectedInterestId) return;
        setIsLoading(true);
        try {
            await addUserInterest(Number(selectedInterestId));
            onUpdate();
            setSelectedInterestId("");
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'ajout de l'intérêt.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveInterest = async (skillId: number) => {
        if (!confirm("Voulez-vous vraiment retirer cet intérêt ?")) return;
        setIsLoading(true);
        try {
            await removeUserInterest(skillId);
            onUpdate();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la suppression de l'intérêt.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open z-50">
            <div className="modal-box w-11/12 max-w-3xl relative overflow-hidden bg-base-100">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    <X size={20} />
                </button>

                <h3 className="font-bold text-2xl mb-6 text-center">Éditer mon profil</h3>

                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}

                {/* Tabs */}
                <div className="tabs tabs-boxed justify-center mb-6 bg-base-200 p-2 rounded-xl">
                    <a
                        className={`tab tab-lg ${activeTab === "info" ? "tab-active font-bold" : ""}`}
                        onClick={() => setActiveTab("info")}
                    >
                        Infos Perso
                    </a>
                    <a
                        className={`tab tab-lg ${activeTab === "skills" ? "tab-active font-bold" : ""}`}
                        onClick={() => setActiveTab("skills")}
                    >
                        Compétences
                    </a>
                    <a
                        className={`tab tab-lg ${activeTab === "interests" ? "tab-active font-bold" : ""}`}
                        onClick={() => setActiveTab("interests")}
                    >
                        Intérêts
                    </a>
                </div>

                <div className="p-1">
                    {/* TAB: INFOS */}
                    {activeTab === "info" && (
                        <form onSubmit={handleInfoSubmit} className="space-y-4">
                            <div className="flex flex-col items-center gap-4 mb-6">
                                <div className="avatar">
                                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar Preview" />
                                        ) : (
                                            <div className="bg-neutral-focus text-neutral-content rounded-full w-24 h-24 flex items-center justify-center">
                                                <span className="text-3xl">{user.firstName[0]}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-control w-full max-w-xs">
                                    <label className="label cursor-pointer justify-center border-2 border-dashed border-gray-400 rounded-lg p-2 hover:bg-base-200 transition">
                                        <span className="label-text flex items-center gap-2 font-semibold">
                                            <Upload size={16} /> Changer la photo
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Prénom</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={formData.firstName || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, firstName: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Nom</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={formData.lastName || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, lastName: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Bio / 'A propos'</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    value={formData.content || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, content: e.target.value })
                                    }
                                    placeholder="Décrivez-vous en quelques mots..."
                                ></textarea>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Ville / Pays</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.location || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, location: e.target.value })
                                    }
                                    placeholder="Ex: Paris, France"
                                />
                            </div>

                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Genre</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.gender || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            gender: e.target.value as "M" | "F" | "A",
                                        })
                                    }
                                >
                                    <option value="">Non spécifié</option>
                                    <option value="M">Homme</option>
                                    <option value="F">Femme</option>
                                    <option value="A">Autre</option>
                                </select>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB: SKILLS */}
                    {activeTab === "skills" && (
                        <div className="space-y-6">
                            <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-semibold mb-3">Ajouter une compétence</h4>
                                <div className="flex gap-2">
                                    <select
                                        className="select select-bordered w-full"
                                        value={selectedSkillId}
                                        onChange={(e) => setSelectedSkillId(e.target.value)}
                                    >
                                        <option value="">Sélectionner une compétence...</option>
                                        {availableSkills
                                            .filter(
                                                (s) => !user.skills?.some((us) => us.id === s.id)
                                            )
                                            .map((skill) => (
                                                <option key={skill.id} value={skill.id}>
                                                    {skill.title} ({typeof skill.category === 'string' ? skill.category : skill.category.title})
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleAddSkill}
                                        disabled={!selectedSkillId || isLoading}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="divider">Vos Compétences</div>

                            <div className="flex flex-wrap gap-3">
                                {user.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="badge badge-lg badge-outline gap-2 p-4 hover:bg-base-200 transition-colors"
                                        >
                                            <span>{skill.title}</span>
                                            <button
                                                onClick={() => handleRemoveSkill(skill.id)}
                                                className="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10"
                                                title="Retirer"
                                                disabled={isLoading}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic w-full text-center py-4">
                                        Aucune compétence ajoutée pour le moment.
                                    </p>
                                )}
                            </div>
                            <div className="modal-action">
                                <button className="btn" onClick={onClose}>Fermer</button>
                            </div>
                        </div>
                    )}

                    {/* TAB: INTERESTS */}
                    {activeTab === "interests" && (
                        <div className="space-y-6">
                            <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-semibold mb-3">Ajouter un intérêt</h4>
                                <div className="flex gap-2">
                                    <select
                                        className="select select-bordered w-full"
                                        value={selectedInterestId}
                                        onChange={(e) => setSelectedInterestId(e.target.value)}
                                    >
                                        <option value="">Sélectionner un intérêt...</option>
                                        {availableSkills
                                            .filter(
                                                (s) => !user.interests?.some((ui) => ui.id === s.id)
                                            )
                                            .map((skill) => (
                                                <option key={skill.id} value={skill.id}>
                                                    {skill.title} ({typeof skill.category === 'string' ? skill.category : skill.category.title})
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleAddInterest}
                                        disabled={!selectedInterestId || isLoading}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="divider">Vos Intérêts</div>

                            <div className="flex flex-wrap gap-3">
                                {user.interests && user.interests.length > 0 ? (
                                    user.interests.map((interest) => (
                                        <div
                                            key={interest.id}
                                            className="badge badge-lg badge-neutral gap-2 p-4"
                                        >
                                            <span>{interest.title}</span>
                                            <button
                                                onClick={() => handleRemoveInterest(interest.id)}
                                                className="btn btn-ghost btn-xs btn-circle text-gray-400 hover:text-white"
                                                title="Retirer"
                                                disabled={isLoading}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic w-full text-center py-4">
                                        Aucun intérêt ajouté pour le moment.
                                    </p>
                                )}
                            </div>
                            <div className="modal-action">
                                <button className="btn" onClick={onClose}>Fermer</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </div>
    );
}
