import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

interface CategoryDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

const CategoryDropdown = ({ value, onChange }: CategoryDropdownProps) => {
    const { t } = useTranslation();

    return (
        <div className="relative flex items-center bg-gray-100 hover:bg-gray-200 border-r border-gray-300 rounded-l-md cursor-pointer transition-colors h-full px-2 focus-within:ring-2 focus-within:ring-secondary">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-transparent border-none text-xs text-gray-700 py-2 pr-4 pl-1 outline-none cursor-pointer z-10 w-full"
            >
                <option value="all">All</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Garden</option>
                <option value="toys">Toys</option>
                <option value="beauty">Beauty</option>
            </select>
            <ChevronDown className="absolute right-1 w-3 h-3 text-gray-600 pointer-events-none" />
        </div>
    );
};

export default CategoryDropdown;
