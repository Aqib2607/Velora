import { useState } from "react";
import { Search, Package, RefreshCw, CreditCard, User, Truck, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRegionStore } from "@/store/useRegionStore";
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/layout/HeroSection";
import SectionBlock from "@/components/layout/SectionBlock";
import FAQAccordion from "@/components/layout/FAQAccordion";
import CTASection from "@/components/layout/CTASection";

const CustomerServicePage = () => {
    const { t } = useTranslation();
    const { country: region } = useRegionStore();
    const [ticketForm, setTicketForm] = useState({ name: '', email: '', orderId: '', issueType: 'delivery', message: '' });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const faqs = [
        { question: t("support.faq1_q", "How long does shipping take?"), answer: t("support.faq1_a", "Standard shipping usually takes 3-5 business days. Velora Prime members enjoy free 1-2 day delivery.") },
        { question: t("support.faq2_q", "What is the return policy?"), answer: t("support.faq2_a", "You can return most unopened items within 30 days of delivery for a full refund.") },
        { question: t("support.faq3_q", "How do I track my order?"), answer: t("support.faq3_a", "Go to your Account > Orders. Click the 'Track Package' button next to the order you wish to track.") },
        { question: t("support.faq4_q", "Can I change my delivery address?"), answer: t("support.faq4_a", "Yes, if the order has not yet shipped, you can update the address from your Orders page.") }
    ];

    const handleTicketSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        // Submit logic would go here
    };

    return (
        <PageLayout>
            <HeroSection
                title={t("support.hero_title", "How can we help you today?")}
                subtitle={t("support.hero_subtitle", "Search our knowledge base or get in touch with our team.")}
            >
                <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg flex items-center p-1 border-2 border-transparent focus-within:border-[#f1c232] transition-colors">
                    <div className="pl-4 pr-2">
                        <Search className="text-gray-400 w-6 h-6" />
                    </div>
                    <input
                        type="text"
                        placeholder={t("support.search_placeholder", "Search for answers... e.g., 'returns'")}
                        className="flex-1 bg-transparent py-4 outline-none text-[#131921] text-lg font-medium placeholder-gray-400"
                    />
                    <button className="bg-[#f1c232] text-[#131921] px-6 py-3 rounded-lg font-bold hover:bg-[#ffe380] transition-colors">
                        {t("support.search_button", "Search")}
                    </button>
                </div>
            </HeroSection>

            <SectionBlock title={t("support.categories_title", "What do you need help with?")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SupportCard icon={<Package />} title={t("support.track_title", "A delivery, order or return")} link="/info/orders" />
                    <SupportCard icon={<RefreshCw />} title={t("support.returns_title", "Returns & Refunds")} />
                    <SupportCard icon={<CreditCard />} title={t("support.payment_title", "Payment & Gift Cards")} />
                    <SupportCard icon={<User />} title={t("support.account_title", "Login & Security")} />
                    <SupportCard icon={<Truck />} title={t("support.shipping_title", "Shipping policies")} />
                    <SupportCard icon={<MessageSquare />} title={t("support.contact_title", "Contact Us")} isPrimary />
                </div>
            </SectionBlock>

            <SectionBlock bgWhite title={t("support.ticket_title", "Submit a Support Ticket")} subtitle={t("support.ticket_subtitle", `Our ${region} support team usually responds within 24 hours.`)}>
                <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm p-6 sm:p-10">
                    {formSubmitted ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-[#131921] dark:text-white">Ticket Submitted!</h3>
                            <p className="text-gray-600 dark:text-gray-400">We've received your request and will email you shortly.</p>
                            <button
                                onClick={() => setFormSubmitted(false)}
                                className="mt-6 text-[#6a329f] dark:text-[#f1c232] font-semibold hover:underline"
                            >
                                Submit another ticket
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleTicketSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
                                    <input required type="text" value={ticketForm.name} onChange={e => setTicketForm({ ...ticketForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none transition-all dark:text-white" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email Address</label>
                                    <input required type="email" value={ticketForm.email} onChange={e => setTicketForm({ ...ticketForm, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none transition-all dark:text-white" placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Order ID (Optional)</label>
                                    <input type="text" value={ticketForm.orderId} onChange={e => setTicketForm({ ...ticketForm, orderId: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none transition-all dark:text-white" placeholder="VLR-12345" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Issue Type</label>
                                    <select value={ticketForm.issueType} onChange={e => setTicketForm({ ...ticketForm, issueType: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none transition-all dark:text-white appearance-none">
                                        <option value="delivery">Where's my stuff?</option>
                                        <option value="returns">Returns & Refunds</option>
                                        <option value="account">Account & Payment</option>
                                        <option value="other">Other Inquiry</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Message</label>
                                <textarea required rows={4} value={ticketForm.message} onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none transition-all resize-none dark:text-white" placeholder="Please describe your issue in detail..."></textarea>
                            </div>

                            <button type="submit" className="w-full bg-[#f1c232] hover:bg-[#ffe380] text-[#131921] font-bold py-4 rounded-xl shadow-sm transition-all hover:shadow-md transform hover:-translate-y-0.5">
                                Submit Ticket
                            </button>
                        </form>
                    )}
                </div>
            </SectionBlock>

            <SectionBlock title={t("support.faq_title", "Frequently Asked Questions")}>
                <FAQAccordion items={faqs} />
            </SectionBlock>

            <CTASection
                theme="purple"
                title="Need instant help?"
                description="Our AI Assistant is available 24/7. Live agents are currently online."
                buttonText="Start Live Chat"
                buttonLink="#"
            />
        </PageLayout>
    );
};

// Helper Component for the Category Grid
const SupportCard = ({ icon, title, link = "#", isPrimary = false }: { icon: React.ReactNode, title: string, link?: string, isPrimary?: boolean }) => {
    return (
        <a href={link} className={`flex items-start gap-4 p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus:ring-2 focus:ring-[#6a329f] ${isPrimary ? 'bg-gradient-to-br from-[#6a329f] to-[#5a2a8f] text-white border-transparent' : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-[#6a329f] dark:hover:border-[#f1c232]'}`}>
            <div className={`p-3 rounded-xl shrink-0 ${isPrimary ? 'bg-white/20' : 'bg-purple-50 dark:bg-[#6a329f]/20 text-[#6a329f] dark:text-[#f1c232]'}`}>
                <div className="w-6 h-6">{icon}</div>
            </div>
            <div>
                <h3 className={`font-bold text-lg mb-1 leading-tight ${isPrimary ? 'text-white' : 'text-[#131921] dark:text-white'}`}>{title}</h3>
                <p className={`text-sm ${isPrimary ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>Click for more help</p>
            </div>
        </a>
    );
};

export default CustomerServicePage;
