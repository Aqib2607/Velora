const BackToTop = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            className="w-full bg-secondary/10 hover:bg-secondary/20 border-b border-border transition-colors py-4 text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
            aria-label="Back to top"
        >
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                Back to top
            </span>
        </button>
    );
};

export default BackToTop;
