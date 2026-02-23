import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface InfoPageLayoutProps {
    title: string;
    subtitle?: string;
    breadcrumb: Array<{ label: string; href: string }>;
    children: React.ReactNode;
}

const InfoPageLayout = ({ title, subtitle, breadcrumb, children }: InfoPageLayoutProps) => {
    // Update document title for SEO
    React.useEffect(() => {
        document.title = `${title} | Velora`;
    }, [title]);

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Hero Section */}
            <div className="bg-secondary/10 py-12 border-b border-border">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        {breadcrumb.map((crumb, index) => (
                            <React.Fragment key={crumb.href}>
                                <ChevronRight className="h-4 w-4" />
                                {index === breadcrumb.length - 1 ? (
                                    <span className="text-foreground font-medium">{crumb.label}</span>
                                ) : (
                                    <Link to={crumb.href} className="hover:text-primary transition-colors">
                                        {crumb.label}
                                    </Link>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <main className="container mx-auto px-4 lg:px-8 py-12">
                <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-10 prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 transition-colors">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default InfoPageLayout;
