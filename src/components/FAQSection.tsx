import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const faqs = [
    { q: "How do I track my order?", a: "You can track your order by going to 'My Orders' in your account. Click on any order to see real-time tracking updates." },
    { q: "What is your return policy?", a: "We offer a 30-day return policy for most items. Products must be unused and in original packaging." },
    { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping is 2-3 days. Same-day delivery is available in select cities." },
    { q: "Do you ship internationally?", a: "Yes! We ship to over 120 countries. International shipping typically takes 7-14 business days." },
    { q: "How can I become a vendor?", a: "Click 'Become a Vendor' and complete the registration process. Our team will review your application within 48 hours." },
    { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, PayPal, Bkash, Nagad, and Cash on Delivery in select regions." }
];

export function FAQSection() {
    return (
        <section id="faq" className="py-20 px-4 bg-muted/30">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-muted-foreground mb-6">Find quick answers to common questions</p>
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search FAQs..." className="pl-10 bg-background" />
                        </div>
                    </div>
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="glass-card rounded-lg px-6 border-0">
                                <AccordionTrigger className="hover:no-underline py-4 text-left font-medium">{faq.q}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-4">{faq.a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}
