import { ReactNode } from "react";

interface PageLayoutProps {
    children: ReactNode;
    className?: string;
}

const PageLayout = ({ children, className = "" }: PageLayoutProps) => {
    return (
        <div className={`min-h-screen bg-[#f8f9fa] dark:bg-zinc-950 text-[#131921] dark:text-gray-100 transition-colors duration-200 ${className}`}>
            {children}
        </div>
    );
};

export default PageLayout;
