import { useState } from "react";
import { TrendingUp, PackageCheck, BarChart4, ShieldCheck, Globe2, Truck, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRegionStore } from "@/store/useRegionStore";
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/layout/HeroSection";
import SectionBlock from "@/components/layout/SectionBlock";
import FAQAccordion from "@/components/layout/FAQAccordion";
import CTASection from "@/components/layout/CTASection";

const SellPage = () => {
    const { t } = useTranslation();
    const { currency, country: region } = useRegionStore();

    // Calculator State
    const [calcPrice, setCalcPrice] = useState<number>(100);
    const [calcCategory, setCalcCategory] = useState<string>('electronics');
    const [calcFulfill, setCalcFulfill] = useState<'seller' | 'velora'>('velora');

    // Seller Signup Form State
    const [sellerForm, setSellerForm] = useState({ businessName: '', email: '', phone: '', country: region });

    const faqs = [
        { question: t("sell.faq1_q", "How much does it cost to sell on Velora?"), answer: t("sell.faq1_a", `Registration is free. You only pay a category-specific commission fee when an item sells. See our pricing page for exact rates in ${region}.`) },
        { question: t("sell.faq2_q", "What is 'Fulfilled by Velora'?"), answer: t("sell.faq2_a", "You send your products to Velora fulfillment centers, and we pack, ship, and provide customer service for these products. This makes your products eligible for Velora Prime.") },
        { question: t("sell.faq3_q", "How do I get paid?"), answer: t("sell.faq3_a", `Payments are automatically deposited into your registered bank account every 14 days in ${currency}, minus any seller fees.`) },
        { question: t("sell.faq4_q", "Can I sell internationally?"), answer: t("sell.faq4_a", "Yes! You can instantly list your products globally. Velora handles currency conversion and global shipping logistics.") }
    ];

    // Dummy commission logic
    const getCommissionRate = (category: string) => {
        switch (category) {
            case 'electronics': return 0.08;
            case 'clothing': return 0.15;
            case 'home': return 0.12;
            case 'books': return 0.10;
            default: return 0.10;
        }
    };

    const calculateProfit = () => {
        const commission = calcPrice * getCommissionRate(calcCategory);
        const fulfillmentFee = calcFulfill === 'velora' ? 4.50 : 0; // Flat fee simulation
        const profit = calcPrice - commission - fulfillmentFee;
        return {
            commission: commission.toFixed(2),
            fee: fulfillmentFee.toFixed(2),
            profit: profit > 0 ? profit.toFixed(2) : '0.00'
        };
    };

    const results = calculateProfit();

    return (
        <PageLayout>
            <HeroSection
                title={t("sell.hero_title", "Become a Velora Seller")}
                subtitle={t("sell.hero_subtitle", "Reach millions of customers, build your brand, and grow your business with our world-class fulfillment network.")}
            >
                <button className="bg-[#f1c232] text-[#131921] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffe380] transition-transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 max-w-sm w-full">
                    {t("sell.start_button", "Start Selling")} <ArrowRight className="w-5 h-5" />
                </button>
            </HeroSection>

            <SectionBlock title={t("sell.steps_title", "How it works")}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    <StepCard number="1" title="Register" desc="Create your account and verify your business identity." />
                    <StepCard number="2" title="List" desc="Add your products to the Velora catalog globally." />
                    <StepCard number="3" title="Sell" desc="Customers purchase your items safely." />
                    <StepCard number="4" title="Ship & Earn" desc="Fulfill orders yourself or let Velora do it. Get paid!" />
                </div>
            </SectionBlock>

            <SectionBlock bgWhite title={t("sell.calc_title", "Estimate Your Margins")} subtitle={t("sell.calc_subtitle", "See how much you could earn on each sale.")}>
                <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-lg p-6 sm:p-10 flex flex-col lg:flex-row gap-10">

                    {/* Controls */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#131921] dark:text-gray-200">Item Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">{currency}</span>
                                <input
                                    type="number" min="1" value={calcPrice} onChange={e => setCalcPrice(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#131921] dark:text-gray-200">Product Category</label>
                            <select value={calcCategory} onChange={e => setCalcCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white appearance-none">
                                <option value="electronics">Electronics (8%)</option>
                                <option value="clothing">Clothing & Apparel (15%)</option>
                                <option value="home">Home & Kitchen (12%)</option>
                                <option value="books">Books & Media (10%)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#131921] dark:text-gray-200">Fulfillment Method</label>
                            <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                                <button
                                    onClick={() => setCalcFulfill('seller')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${calcFulfill === 'seller' ? 'bg-white dark:bg-zinc-700 shadow-sm text-[#131921] dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    Fulfill Yourself
                                </button>
                                <button
                                    onClick={() => setCalcFulfill('velora')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${calcFulfill === 'velora' ? 'bg-[#6a329f] shadow-sm text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    Fulfilled by Velora
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Board */}
                    <div className="w-full lg:w-1/2 shrink-0 bg-gray-50 dark:bg-black/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-center border border-gray-100 dark:border-zinc-800">
                        <h3 className="text-xl font-bold mb-6 text-center text-[#131921] dark:text-white">Estimated Revenue Breakdown</h3>

                        <div className="space-y-4 font-medium mb-6">
                            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                <span>Sale Price</span>
                                <span className="text-[#131921] dark:text-white">{currency}{calcPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-red-500/80">
                                <span>Commission ({(getCommissionRate(calcCategory) * 100).toFixed(0)}%)</span>
                                <span>-{currency}{results.commission}</span>
                            </div>
                            {calcFulfill === 'velora' && (
                                <div className="flex justify-between items-center text-red-500/80">
                                    <span>Velora Fulfillment Fee</span>
                                    <span>-{currency}{results.fee}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-200 dark:border-zinc-700/50 flex justify-between items-end">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Your Profit</p>
                                <p className="text-xs text-gray-400 mt-1">per unit sold</p>
                            </div>
                            <p className="text-4xl sm:text-5xl font-extrabold text-[#6a329f] dark:text-[#f1c232]">
                                {currency}{results.profit}
                            </p>
                        </div>
                    </div>
                </div>
            </SectionBlock>

            <SectionBlock title={t("sell.tools_title", "Powerful Tools to Grow")}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ToolCard icon={<TrendingUp />} title="Brand Analytics" desc="Gain deep insights into your customers' search behavior and conversion rates." />
                    <ToolCard icon={<Globe2 />} title="Global Expansion" desc="List once, sell globally. We handle export complexities and localization." />
                    <ToolCard icon={<PackageCheck />} title="A+ Fulfillment" desc="Store your products in Velora warehouses for lightning-fast delivery to buyers." />
                </div>
            </SectionBlock>

            <SectionBlock bgWhite title={t("sell.signup_title", "Start Your Journey Today")} subtitle="Join thousands of successful sellers.">
                <form className="max-w-xl mx-auto space-y-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-3xl shadow-sm" onSubmit={(e) => e.preventDefault()}>
                    <input required type="text" placeholder="Business or Legal Name" value={sellerForm.businessName} onChange={e => setSellerForm({ ...sellerForm, businessName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white" />
                    <input required type="email" placeholder="Business Email" value={sellerForm.email} onChange={e => setSellerForm({ ...sellerForm, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white" />
                    <input required type="tel" placeholder="Phone Number" value={sellerForm.phone} onChange={e => setSellerForm({ ...sellerForm, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white" />

                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl flex gap-3 my-4 items-start text-sm">
                        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>To comply with Security & KYC requirements in {region}, you will need to provide valid tax identification during onboarding.</p>
                    </div>

                    <button className="w-full bg-[#131921] dark:bg-white text-white dark:text-[#131921] font-bold py-4 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 mt-2">
                        Create Seller Account
                    </button>
                </form>
            </SectionBlock>

            <SectionBlock title={t("sell.faq_title", "Frequently Asked Questions")}>
                <FAQAccordion items={faqs} />
            </SectionBlock>

            <CTASection
                theme="gold"
                title="Ready to reach millions?"
                description="Don't miss out on the opportunity to scale your business with the ultimate retail partner."
                buttonText="Apply Now"
                buttonLink="#"
            />

        </PageLayout>
    );
};

const StepCard = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
    <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#f1c232] text-[#131921] flex items-center justify-center text-2xl font-black mb-4 shadow-md">
            {number}
        </div>
        <h3 className="font-bold text-lg mb-2 text-[#131921] dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
);

const ToolCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 flex flex-col items-start hover:shadow-md transition-shadow">
        <div className="p-3 bg-purple-50 dark:bg-zinc-800 text-[#6a329f] dark:text-[#f1c232] rounded-xl mb-4">
            <div className="w-6 h-6">{icon}</div>
        </div>
        <h4 className="font-bold text-lg mb-2 text-[#131921] dark:text-white">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
    </div>
);

export default SellPage;
