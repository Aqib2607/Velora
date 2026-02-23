import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryDropdown from "./CategoryDropdown";
import { useTranslation } from "react-i18next";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}&category=${category}`);
        }
    };

    return (
        <form
            onSubmit={handleSearch}
            className="flex flex-1 h-11 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#f1c232] transition-shadow shadow-sm"
        >
            <CategoryDropdown value={category} onChange={setCategory} />

            <input
                type="text"
                placeholder={t("nav.search") + " Velora"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-sm text-black outline-none w-full"
            />

            <button
                type="submit"
                className="bg-[#f1c232] hover:bg-[#d4a72c] px-5 flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Submit search"
            >
                <Search className="h-5 w-5 text-black" />
            </button>
        </form>
    );
};

export default SearchBar;
