import { ReactNode } from "react";

interface SectionBlockProps {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
    bgWhite?: boolean;
}

const SectionBlock = ({ title, subtitle, children, className = "", bgWhite = false }: SectionBlockProps) => {
    return (
        <section className={`py-12 sm:py-16 px-4 sm:px-6 lg:px-8 ${bgWhite ? 'bg-white dark:bg-zinc-900 border-y border-gray-100 dark:border-zinc-800' : ''} ${className}`}>
            <div className="max-w-6xl mx-auto">
                {(title || subtitle) && (
                    <div className="text-center mb-10 sm:mb-14">
                        {title && <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-[#131921] dark:text-white">{title}</h2>}
                        {subtitle && <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
};

export default SectionBlock;
