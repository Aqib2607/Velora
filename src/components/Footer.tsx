import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="glass border-t border-border/50 pt-16 pb-8 border-x-0 border-b-0">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">N</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight">Velora</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Velora is your one-stop shop for everything you need. Quality products, fast shipping, and excellent customer service.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link to="/featured" className="text-sm text-muted-foreground hover:text-primary transition-colors">Featured</Link></li>
                            <li><Link to="/deals" className="text-sm text-muted-foreground hover:text-primary transition-colors">Daily Deals</Link></li>
                            <li><Link to="/vendor-dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sell on Velora</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>

                            <li><Link to="/shipping-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">Returns & Exchanges</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter (Simplified) */}
                    <div>
                        <h3 className="font-semibold mb-4">Stay Connected</h3>
                        <p className="text-sm text-muted-foreground mb-4">Subscribe to get the latest news and updates.</p>
                        <div className="flex gap-2">
                            <input
                                id="subscribe-email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Velora Commerce. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        <span>by Velora Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
