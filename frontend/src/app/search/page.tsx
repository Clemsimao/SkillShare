"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchFilters from "./components/SearchFilters";
import UserResults from "./components/UserResults";
import TutorialResults from "./components/TutorialResults";
import { searchUsers, searchTutorials } from "@/integration/services/search";
import { User, Tutorial } from "@/integration/types/api";
import { Loader2, Search as SearchIcon } from "lucide-react";

type SearchTab = "users" | "tutorials";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') === 'tutorials' ? 'tutorials' : 'users';

    const [activeTab, setActiveTab] = useState<SearchTab>(initialTab);
    const [filters, setFilters] = useState<{ categoryId: number | null; skillId: number | null }>({
        categoryId: null,
        skillId: null,
    });

    const [users, setUsers] = useState<User[]>([]);
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [loading, setLoading] = useState(false);
    // State pour la recherche textuelle
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Debounce search query
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Trigger search when filters, tab or debounced query changes
    useEffect(() => {
        const performSearch = async () => {
            // Si aucun filtre et aucune recherche, on charge TOUT (comportement "Tout")
            // if (!filters.categoryId && !filters.skillId && !debouncedQuery) { ... } -> Removed

            setLoading(true);
            setError(null);

            try {
                if (activeTab === "users") {
                    const res = await searchUsers({
                        categoryId: filters.categoryId || undefined,
                        skillId: filters.skillId || undefined,
                        q: debouncedQuery || undefined,
                        limit: 20
                    });
                    setUsers(res.users);
                } else {
                    const res = await searchTutorials({
                        categoryId: filters.categoryId || undefined,
                        skillId: filters.skillId || undefined,
                        q: debouncedQuery || undefined,
                        limit: 20
                    });
                    setTutorials(res.tutorials);
                }
            } catch (err: any) {
                console.error("Search error:", err);
                setError("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [activeTab, filters, debouncedQuery]);

    const handleFilterChange = (type: 'skill' | 'category', id: number | null) => {
        setFilters(prev => ({
            ...prev,
            [type === 'category' ? 'categoryId' : 'skillId']: id,
            [type === 'category' ? 'skillId' : 'categoryId']: type === 'category' ? null : prev.categoryId,
        }));
        if (type === 'category') {
            setFilters({ categoryId: id, skillId: null });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <SearchIcon className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">Recherche</h1>
                </div>

                {/* BARRE DE RECHERCHE TEXTUELLE */}
                <div className="form-control w-full md:w-auto">
                    <input
                        type="text"
                        placeholder={activeTab === 'users' ? "Rechercher un expert par nom..." : "Rechercher un tutoriel par titre..."}
                        className="input input-bordered w-full md:w-80"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-1/4 min-w-[250px]">
                    <SearchFilters
                        activeCategory={filters.categoryId}
                        onFilterChange={handleFilterChange}
                    />
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Tabs */}
                    <div role="tablist" className="tabs tabs-boxed mb-6">
                        <button
                            role="tab"
                            className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("users")}
                        >
                            Experts
                        </button>
                        <button
                            role="tab"
                            className={`tab ${activeTab === "tutorials" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("tutorials")}
                        >
                            Tutoriels
                        </button>
                    </div>

                    {/* Results Area */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-base-content/50">
                                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                                <p>Recherche en cours...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        ) : (
                            activeTab === "users" ? (
                                <UserResults users={users} />
                            ) : (
                                <TutorialResults tutorials={tutorials} />
                            )
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
