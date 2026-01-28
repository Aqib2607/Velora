import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface Category {
    id: number;
    name: string;
    slug: string;
    children?: Category[];
}

const CategoryItem = ({ category, level = 0 }: { category: Category, level?: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div className="border-b border-border/50 last:border-0">
            <div className={`flex items-center justify-between p-3 hover:bg-muted/50 transition-colors ${level > 0 ? 'ml-6 border-l border-border/50' : ''}`}>
                <div className="flex items-center gap-2">
                    {hasChildren ? (
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                        </CollapsibleTrigger>
                    ) : (
                        <div className="w-6" />
                    )}
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="outline" className="text-xs text-muted-foreground ml-2">
                        {category.slug}
                    </Badge>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {hasChildren && isOpen && (
                <div>
                    {category.children?.map((child) => (
                        <CategoryItem key={child.id} category={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load categories'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <p className="text-muted-foreground">Manage product categories and hierarchy</p>
                </div>
                <Button className="gradient-bg">
                    <Plus className="h-4 w-4 mr-2" /> Add Category
                </Button>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        <CardTitle>Category Tree</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
                    ) : (
                        <Collapsible open={true}>
                            <div className="rounded-md border border-border">
                                {categories.map((category) => (
                                    <CategoryItem key={category.id} category={category} />
                                ))}
                            </div>
                        </Collapsible>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
