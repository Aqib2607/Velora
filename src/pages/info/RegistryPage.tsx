import { useState } from "react";
import { Search, Gift, Heart, Baby, Calendar, ShieldCheck, MapPin, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRegionStore } from "@/store/useRegionStore";
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/layout/HeroSection";
import SectionBlock from "@/components/layout/SectionBlock";
import FAQAccordion from "@/components/layout/FAQAccordion";
import CTASection from "@/components/layout/CTASection";

const RegistryPage = () => {
    const { t } = useTranslation();
    const { country: region } = useRegionStore();
    const [registryForm, setRegistryForm] = useState({ eventType: 'wedding', date: '', visibility: 'public', address: '' });
    const [isSearching, setIsSearching] = useState(false);

    const faqs = [
        { question: t("registry.faq1_q", "How do I create a registry?"), answer: t("registry.faq1_a", "Simply sign in to your Velora account, fill out the form above with your event details, and start adding items!") },
        { question: t("registry.faq2_q", "Are gifts automatically shipped to me?"), answer: t("registry.faq2_a", `Yes, gifts are shipped securely to your provided address anywhere in ${region}. We hide the full address from guests for your privacy.`) },
        { question: t("registry.faq3_q", "Can I make my registry private?"), answer: t("registry.faq3_a", "Absolutely. You can set your registry to 'Private' so only people with your direct invite link can view it.") },
        { question: t("registry.faq4_q", "What is group gifting?"), answer: t("registry.faq4_a", "For expensive items, multiple guests can contribute smaller amounts towards the total price.") }
    ];

    return (
        <PageLayout>
            <HeroSection
                title={t("registry.hero_title", "Celebrate Life's Moments with Velora Registry")}
                subtitle={t("registry.hero_subtitle", "Create a registry for your wedding, baby shower, or any special event. Find exactly what you need.")}
            >
                <div className="w-full max-w-lg mt-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex border border-white/20">
                        <input
                            type="text"
                            placeholder={t("registry.search_placeholder", "Search for a registrant's name...")}
                            className="flex-1 bg-transparent px-4 text-white outline-none placeholder-white/60"
                        />
                        <button
                            onClick={() => setIsSearching(true)}
                            className="bg-[#f1c232] text-[#131921] px-6 py-3 rounded-xl font-bold hover:bg-[#ffe380] transition-colors flex items-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            {t("registry.search_button", "Find")}
                        </button>
                    </div>
                    {isSearching && <p className="text-sm mt-3 text-white/80 animate-pulse">Searching registry database...</p>}
                </div>
            </HeroSection>

            <SectionBlock title={t("registry.types_title", "A Registry for Every Occasion")}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <RegistryTypeCard icon={<Heart className="w-8 h-8" />} title="Wedding Registry" description="Everything you need to start your new life together, from kitchenware to smart home devices." />
                    <RegistryTypeCard icon={<Baby className="w-8 h-8" />} title="Baby Registry" description="Prepare for your little one with top-rated strollers, cribs, and newborn essentials." />
                    <RegistryTypeCard icon={<Gift className="w-8 h-8" />} title="Custom Event" description="Graduations, housewarmings, or charity drives. Build a list for any purpose." />
                </div>
            </SectionBlock>

            <SectionBlock bgWhite title={t("registry.create_title", "Create Your Registry")} subtitle={t("registry.create_subtitle", "It takes just 2 minutes to set up your event.")}>
                <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-lg p-8">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-[#131921] dark:text-gray-200">Event Type</label>
                                <select value={registryForm.eventType} onChange={e => setRegistryForm({ ...registryForm, eventType: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white">
                                    <option value="wedding">Wedding</option>
                                    <option value="baby">Baby Shower</option>
                                    <option value="housewarming">Housewarming</option>
                                    <option value="other">Other Celebration</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-[#131921] dark:text-gray-200">Event Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input type="date" value={registryForm.date} onChange={e => setRegistryForm({ ...registryForm, date: e.target.value })} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#131921] dark:text-gray-200">Shipping Address (Hidden from guests)</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input type="text" placeholder={`123 Main St, ${region}`} value={registryForm.address} onChange={e => setRegistryForm({ ...registryForm, address: e.target.value })} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white" />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Gifts will be shipped via secure regional fulfillment in {region}.</p>
                        </div>

                        <div className="bg-purple-50 dark:bg-[#6a329f]/10 rounded-xl p-4 flex gap-4 border border-purple-100 dark:border-[#6a329f]/30">
                            <ShieldCheck className="text-[#6a329f] dark:text-[#f1c232] shrink-0 w-6 h-6" />
                            <div>
                                <h4 className="font-semibold text-[#131921] dark:text-white text-sm">Privacy & Visibility</h4>
                                <div className="mt-2 space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={registryForm.visibility === 'public'} onChange={() => setRegistryForm({ ...registryForm, visibility: 'public' })} className="text-[#6a329f] focus:ring-[#6a329f]" />
                                        <span className="text-sm dark:text-gray-300">Public (Searchable by name)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={registryForm.visibility === 'private'} onChange={() => setRegistryForm({ ...registryForm, visibility: 'private' })} className="text-[#6a329f] focus:ring-[#6a329f]" />
                                        <span className="text-sm dark:text-gray-300">Private (Link access only)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#f1c232] hover:bg-[#ffe380] text-[#131921] font-bold py-4 rounded-xl shadow-sm transition-all hover:shadow-md transform hover:-translate-y-0.5">
                            Create Registry
                        </button>
                        <p className="text-xs text-center text-gray-500">By creating a registry, you agree to the Velora Registry Terms and Conditions.</p>
                    </form>
                </div>
            </SectionBlock>

            <SectionBlock title={t("registry.benefits_title", "Velora Registry Benefits")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    <Feature icon={<Gift />} title="Free Bonus Gifts" desc="Receive bonus gifts from top brands when guests purchase select items." />
                    <Feature icon={<RefreshCw />} title="Extended Returns" desc="Enjoy 90-day returns on most registry gifts." />
                    <Feature icon={<ShieldCheck />} title="Group Gifting" desc="Let multiple guests contribute to higher-priced items." />
                    <Feature icon={<Heart />} title="Completion Discount" desc="Get a 15% discount on remaining unpurchased items." />
                </div>
            </SectionBlock>

            <SectionBlock bgWhite title={t("registry.faq_title", "Frequently Asked Questions")}>
                <FAQAccordion items={faqs} />
            </SectionBlock>

            <CTASection
                theme="dark"
                title="Ready to build your list?"
                description="Join thousands of others who organized their special life events with Velora."
                buttonText="Get Started"
                buttonLink="#"
            />
        </PageLayout>
    );
};

const RegistryTypeCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-3xl shadow-sm text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl group">
        <div className="w-16 h-16 bg-purple-50 dark:bg-zinc-800 text-[#6a329f] dark:text-[#f1c232] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-[#131921] dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
);

const Feature = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex flex-col items-center">
        <div className="w-12 h-12 text-[#6a329f] dark:text-[#f1c232] mb-4">
            {icon}
        </div>
        <h4 className="font-bold text-[#131921] dark:text-white mb-2">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
);

export default RegistryPage;
