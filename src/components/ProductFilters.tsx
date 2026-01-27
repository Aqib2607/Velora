import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductFilters() {
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
                            <Slider defaultValue={[0, 1000]} max={1000} step={10} className="mb-4" />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>$0</span>
                                <span>$1000+</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="categories">
                        <AccordionTrigger>Categories</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map((cat) => (
                                <div key={cat} className="flex items-center space-x-2">
                                    <Checkbox id={cat} />
                                    <Label htmlFor={cat}>{cat}</Label>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="rating">
                        <AccordionTrigger>Rating</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center space-x-2">
                                    <Checkbox id={`r-${rating}`} />
                                    <Label htmlFor={`r-${rating}`} className="flex items-center gap-1">
                                        {rating} <span className="text-yellow-400">★</span> & Up
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
