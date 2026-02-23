import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    items: FAQItem[];
    title?: string;
}

const FAQAccordion = ({ items, title }: FAQAccordionProps) => {
    return (
        <div className="w-full max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-8">
            {title && <h3 className="text-xl font-bold mb-6 text-[#131921] dark:text-white">{title}</h3>}

            <Accordion type="single" collapsible className="w-full">
                {items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100 dark:border-zinc-800 last:border-0">
                        <AccordionTrigger className="text-left font-semibold text-base sm:text-lg hover:text-[#6a329f] dark:hover:text-[#f1c232] transition-colors py-4">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed pb-4">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default FAQAccordion;
