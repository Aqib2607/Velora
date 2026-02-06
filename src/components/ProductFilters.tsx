import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types";

interface ProductFiltersProps {
    minPrice: number;
    maxPrice: number;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    categories: Category[];
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    rating: number | null;
    setRating: (rating: number | null) => void;
}

export function ProductFilters({
    minPrice = 0,
    maxPrice = 1000,
    priceRange,
    setPriceRange,
    categories,
    selectedCategories,
    setSelectedCategories,
    rating,
    setRating
}: ProductFiltersProps) {

    const handleCategoryChange = (categoryId: string) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    return (
        <Card className="glass-card h-fit sticky top-24">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Accordion type="single" collapsible defaultValue="price">
                    <AccordionItem value="price">
                        <AccordionTrigger>Price Range</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                            <Slider
                                defaultValue={[minPrice, maxPrice]}
                                value={priceRange}
                                max={maxPrice}
                                step={10}
                                min={minPrice}
                                onValueChange={(value) => setPriceRange(value as [number, number])}
                                className="mb-4"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>${priceRange[0]}</span>
                                <span>${priceRange[1]}+</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="categories">
                        <AccordionTrigger>Categories</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`cat-${cat.id}`}
                                        checked={selectedCategories.includes(String(cat.id))}
                                        onCheckedChange={() => handleCategoryChange(String(cat.id))}
                                    />
                                    <Label htmlFor={`cat-${cat.id}`}>{cat.name}</Label>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="rating">
                        <AccordionTrigger>Rating</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            {[5, 4, 3, 2, 1].map((r) => (
                                <div key={r} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`r-${r}`}
                                        checked={rating === r}
                                        onCheckedChange={(checked) => setRating(checked ? r : null)}
                                    />
                                    <Label htmlFor={`r-${r}`} className="flex items-center gap-1">
                                        {r} <span className="text-yellow-400">★</span> & Up
                                    </Label>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
