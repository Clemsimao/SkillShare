import { useEffect, useState } from "react";
import { getCategories } from "@/integration/services/public";
import { Category } from "@/integration/types/api";

interface SearchFiltersProps {
    activeCategory: number | null;
    onFilterChange: (type: 'skill' | 'category', id: number | null) => void;
}

export default function SearchFilters({ activeCategory, onFilterChange }: SearchFiltersProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data.categories);
            } catch (error) {
                console.error("Failed to load categories", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return <div className="skeleton h-12 w-full"></div>;

    return (
        <div className="flex flex-col gap-4 p-4 bg-base-200 rounded-box">
            <h3 className="font-bold text-lg">Filtrer par catégorie</h3>
            <div className="flex flex-wrap gap-2">
                <button
                    className={`btn btn-sm ${activeCategory === null ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => onFilterChange('category', null)}
                >
                    Tout
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`btn btn-sm ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => onFilterChange('category', cat.id)}
                    >
                        {cat.title}
                    </button>
                ))}
            </div>
        </div>
    );
}
