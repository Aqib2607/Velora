import { ReactNode } from "react";

interface HeroSectionProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
    backgroundImage?: string;
}

const HeroSection = ({ title, subtitle, children, backgroundImage }: HeroSectionProps) => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#6a329f] to-[#5a2a8f] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 shadow-inner">
            {backgroundImage && (
                <div
                    className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* Decorative Blur Orbs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#f1c232]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-4xl mx-auto text-center z-10">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
                        {subtitle}
                    </p>
                )}
                {children && (
                    <div className="mt-8 flex justify-center w-full">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroSection;
