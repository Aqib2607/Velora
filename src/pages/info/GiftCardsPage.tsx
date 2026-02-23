import { useState } from "react";
import { Gift, Mail, CreditCard, Building2, Smartphone, CheckCircle2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRegionStore } from "@/store/useRegionStore";
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/layout/HeroSection";
import SectionBlock from "@/components/layout/SectionBlock";
import FAQAccordion from "@/components/layout/FAQAccordion";
import CTASection from "@/components/layout/CTASection";

const GiftCardsPage = () => {
    const { t } = useTranslation();
    const { currency, country: region } = useRegionStore();

    const [amount, setAmount] = useState<number | string>(50);
    const [giftForm, setGiftForm] = useState({ to: '', from: '', message: '', quantity: 1, type: 'digital' });

    const predefinedAmounts = [25, 50, 100, 200];

    const faqs = [
        { question: t("giftcards.faq1_q", "Do Velora Gift Cards expire?"), answer: t("giftcards.faq1_a", "No, Velora Gift Cards do not expire and have no maintenance fees.") },
        { question: t("giftcards.faq2_q", "Can I use it on international orders?"), answer: t("giftcards.faq2_a", `Gift cards are bound to the currency they were purchased in (${currency}). Cross-currency conversion fees may apply when used in different regions.`) },
        { question: t("giftcards.faq3_q", "How long does a digital card take to arrive?"), answer: t("giftcards.faq3_a", "Digital gift cards are usually delivered within 5 minutes, but can take up to 2 hours during peak periods.") },
        { question: t("giftcards.faq4_q", "Are gift cards taxable?"), answer: t("giftcards.faq4_a", `Purchasing a gift card is generally tax-free in ${region}, but taxes apply to the items purchased using the gift card.`) }
    ];

    return (
        <PageLayout>
            <HeroSection
                title={t("giftcards.hero_title", "Give the Perfect Gift")}
                subtitle={t("giftcards.hero_subtitle", "They know what they want. Let them choose with a Velora Gift Card.")}
            />

            <SectionBlock title={t("giftcards.types_title", "Choose a Format")}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CardFormat
                        icon={<Smartphone className="w-8 h-8" />}
                        title="Digital eGift Card"
                        desc="Sent immediately via email. Perfect for last-minute gifting."
                        active={giftForm.type === 'digital'}
                        onClick={() => setGiftForm({ ...giftForm, type: 'digital' })}
                    />
                    <CardFormat
                        icon={<Mail className="w-8 h-8" />}
                        title="Physical Gift Card"
                        desc="A beautiful physical card mailed in a premium envelope."
                        active={giftForm.type === 'physical'}
                        onClick={() => setGiftForm({ ...giftForm, type: 'physical' })}
                    />
                    <CardFormat
                        icon={<Building2 className="w-8 h-8" />}
                        title="Corporate / Bulk"
                        desc="Reward your employees or clients with a Velora experience."
                        active={giftForm.type === 'corporate'}
                        onClick={() => setGiftForm({ ...giftForm, type: 'corporate' })}
                    />
                </div>
            </SectionBlock>

            <SectionBlock bgWhite title={t("giftcards.buy_title", "Purchase details")} subtitle={t("giftcards.buy_subtitle", "Customize your gift card.")}>
                <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-lg p-6 sm:p-10 flex flex-col md:flex-row gap-10">

                    {/* Card Preview Window */}
                    <div className="w-full md:w-1/3 shrink-0">
                        <div className="aspect-[1.6/1] w-full rounded-2xl bg-gradient-to-br from-[#131921] to-[#3a4454] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                            <div className="absolute inset-4 flex flex-col justify-between">
                                <h3 className="text-white/90 text-sm font-bold tracking-widest uppercase">Gift Card</h3>
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <div className="h-6 w-6 rounded bg-white/95 shadow-sm flex items-center justify-center">
                                            <span className="text-xs font-bold text-[#131921]">V</span>
                                        </div>
                                        <span className="text-lg font-bold text-white tracking-widest hidden sm:block">Velora</span>
                                    </div>
                                    <p className="text-[#f1c232] text-xl font-bold">{currency} {amount || '0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <form className="space-y-6" onSubmit={e => e.preventDefault()}>

                            <div>
                                <label className="block text-sm font-semibold mb-3 text-[#131921] dark:text-gray-200">Select Amount</label>
                                <div className="flex flex-wrap gap-3">
                                    {predefinedAmounts.map(preset => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(preset)}
                                            className={`px-4 py-2 rounded-xl font-bold transition-all border-2 ${amount === preset ? 'border-[#6a329f] bg-purple-50 text-[#6a329f] dark:bg-[#6a329f]/20 dark:border-[#f1c232] dark:text-[#f1c232]' : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-zinc-700 dark:text-gray-300 dark:hover:border-zinc-600'}`}
                                        >
                                            {currency}{preset}
                                        </button>
                                    ))}
                                    <div className="flex items-center relative">
                                        <span className="absolute left-3 text-gray-500 font-bold">{currency}</span>
                                        <input
                                            type="number"
                                            placeholder="Custom"
                                            value={!predefinedAmounts.includes(Number(amount)) && amount !== '' ? amount : ''}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-24 pl-8 pr-3 py-2 rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-transparent focus:border-[#6a329f] dark:focus:border-[#f1c232] outline-none text-[#131921] dark:text-white font-bold transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {giftForm.type === 'corporate' && (
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-[#131921] dark:text-gray-200">Quantity (Min 10)</label>
                                    <input type="number" min="10" value={giftForm.quantity} onChange={e => setGiftForm({ ...giftForm, quantity: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white" />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-[#131921] dark:text-gray-200">{giftForm.type === 'digital' ? 'Recipient Email' : 'Recipient Name'}</label>
                                    <input type="text" value={giftForm.to} onChange={e => setGiftForm({ ...giftForm, to: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-[#131921] dark:text-gray-200">Your Name</label>
                                    <input type="text" value={giftForm.from} onChange={e => setGiftForm({ ...giftForm, from: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none dark:text-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1 text-[#131921] dark:text-gray-200">Message (Optional)</label>
                                <textarea rows={3} value={giftForm.message} onChange={e => setGiftForm({ ...giftForm, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[#6a329f] outline-none resize-none dark:text-white" placeholder="Write a special message..."></textarea>
                            </div>

                            <div className="text-sm text-gray-500 bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg border border-gray-100 dark:border-zinc-700">
                                Total Price: <span className="font-bold text-[#131921] dark:text-white">{currency}{(Number(amount) || 0) * (giftForm.type === 'corporate' ? giftForm.quantity : 1)}</span>
                                <p className="text-xs mt-1">Tax mapping depends on {region} fulfillment. No tax charged at issuance.</p>
                            </div>

                            <button type="submit" className="w-full bg-[#f1c232] hover:bg-[#ffe380] text-[#131921] font-bold py-4 rounded-xl shadow-sm transition-all hover:shadow-md transform hover:-translate-y-0.5 flex justify-center items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Proceed to Checkout
                            </button>
                        </form>
                    </div>
                </div>
            </SectionBlock>

            <SectionBlock title="How to Redeem">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center gap-8 items-center text-center">
                    <div className="flex-1">
                        <div className="w-16 h-16 bg-purple-50 dark:bg-zinc-900 text-[#6a329f] rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 /></div>
                        <h3 className="font-bold mb-2 dark:text-white">1. Get your code</h3>
                        <p className="text-gray-500 text-sm">Find the claim code on the back of the physical card, or in your email.</p>
                    </div>
                    <div className="hidden md:block w-8 border-t-2 border-dashed border-gray-300"></div>
                    <div className="flex-1">
                        <div className="w-16 h-16 bg-purple-50 dark:bg-zinc-900 text-[#6a329f] rounded-full flex items-center justify-center mx-auto mb-4"><User /></div>
                        <h3 className="font-bold mb-2 dark:text-white">2. Go to your Account</h3>
                        <p className="text-gray-500 text-sm">Navigate to the Gift Cards section inside your Account dashboard.</p>
                    </div>
                    <div className="hidden md:block w-8 border-t-2 border-dashed border-gray-300"></div>
                    <div className="flex-1">
                        <div className="w-16 h-16 bg-purple-50 dark:bg-zinc-900 text-[#6a329f] rounded-full flex items-center justify-center mx-auto mb-4"><Gift /></div>
                        <h3 className="font-bold mb-2 dark:text-white">3. Apply Balance</h3>
                        <p className="text-gray-500 text-sm">Enter the code and the balance will instantly be added to your profile.</p>
                    </div>
                </div>
            </SectionBlock>

            <SectionBlock bgWhite title={t("giftcards.faq_title", "Frequently Asked Questions")}>
                <FAQAccordion items={faqs} />
            </SectionBlock>

        </PageLayout>
    );
};

const CardFormat = ({ icon, title, desc, active, onClick }: { icon: React.ReactNode, title: string, desc: string, active: boolean, onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 focus-visible:outline-none focus:ring-2 focus:ring-[#f1c232] ${active ? 'border-[#6a329f] dark:border-[#f1c232] bg-purple-50/50 dark:bg-[#6a329f]/10 shadow-md' : 'border-transparent bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:-translate-y-1'}`}
    >
        <div className={`mb-4 ${active ? 'text-[#6a329f] dark:text-[#f1c232]' : 'text-gray-400 dark:text-zinc-500'}`}>
            {icon}
        </div>
        <h3 className={`font-bold text-lg mb-2 ${active ? 'text-[#131921] dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">{desc}</p>
    </button>
);

export default GiftCardsPage;
