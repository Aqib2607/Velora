import { useState } from "react";
import DealsFilterSidebar from "@/components/deals/DealsFilterSidebar";
import DealCard from "@/components/deals/DealCard";
import DealsCarousel from "@/components/deals/DealsCarousel";
import { useDealsQuery } from "@/hooks/useDealsQuery";
import { mockDealsDatabase } from "@/lib/mockDealsData";
import { Loader2, ArrowRight } from "lucide-react";
import DealCountdown from "@/components/deals/DealCountdown";

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const quickFilters = ["Lightning Deals", "Clearance", "Under $25", "Prime Early Access"];

const TodaysDealsPage = () => {
    const [page, setPage] = useState(1);

    // In a real infinite-scroll, we would use useInfiniteQuery and append pages.
    // For this mock implementation, we fetch a large slice or use pagination blocks.
    const { data: dealsResponse, isLoading, isError } = useDealsQuery(1, 40); // Fetch top 40 for grid

    const trendingDeals = mockDealsDatabase.slice(20, 30); // Mock trending row
    const under50Deals = mockDealsDatabase.filter(d => d.discountPrice < 50).slice(0, 10);

    return (
        <div className="min-h-screen bg-[#f3f4f6]">

            {/* 1. Hero Section (Purple Gradient) */}
            <section className="bg-gradient-to-r from-[#6a329f] to-[#b4a7d6] text-white pt-10 pb-16 px-4 md:px-8 shadow-inner">
                <div className="max-w-[1600px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 drop-shadow-md">
                                Today's Deals
                            </h1>
                            <p className="text-[#f1c232] font-semibold text-lg flex flex-wrap items-center gap-2">
                                Incredible savings, refresh daily.
                                <span className="bg-white/20 px-3 py-1 rounded-full text-white text-sm backdrop-blur-sm border border-white/30 hidden sm:inline-block">
                                    Ends in <DealCountdown endTimeISO={endOfDay.toISOString()} />
                                </span>
                            </p>
                        </div>

                        {/* Quick filter styling chips */}
                        <div className="flex flex-wrap gap-2">
                            {quickFilters.map((q) => (
                                <button key={q} className="bg-white/10 hover:bg-white/20 border border-white/30 transition-all text-sm font-semibold px-4 py-2 rounded-full cursor-not-allowed hidden md:block">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Main Dual-Layout Architecture */}
            <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 -mt-10 relative z-10">
                <div className="flex gap-8">

                    {/* Left: Sticky Sidebar (Desktop Only) */}
                    <div className="hidden lg:block">
                        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                            <DealsFilterSidebar />
                        </div>
                    </div>

                    {/* Right: Dynamic Deals Content */}
                    <div className="flex-1 min-w-0">
                        {/* Carousels block */}
                        <DealsCarousel title="Trending Right Now" deals={trendingDeals} />
                        <DealsCarousel title="Steals Under $50" deals={under50Deals} />

                        {/* Status Check for Main Grid */}
                        <div className="flex items-center justify-between mt-12 mb-6">
                            <h2 className="text-2xl font-black text-[#131921]">All Available Deals</h2>
                            {dealsResponse?.total && (
                                <span className="text-sm font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{dealsResponse.total} Results</span>
                            )}
                        </div>

                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 text-[#6a329f]">
                                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                                <h3 className="text-xl font-bold">Uncovering the best discounts...</h3>
                            </div>
                        )}

                        {isError && (
                            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 font-bold">
                                Error connecting to promotion engine. Please try again.
                            </div>
                        )}

                        {/* Main Grid: Responsive 2-col mobile up to 5-col desktop */}
                        {dealsResponse && dealsResponse.data.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
                                {dealsResponse.data.map((deal) => (
                                    <DealCard key={deal.id} deal={deal} />
                                ))}
                            </div>
                        )}

                        {dealsResponse && dealsResponse.data.length === 0 && (
                            <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100 mt-8">
                                <h3 className="text-2xl font-bold text-[#131921] mb-2">No deals match your exact filters.</h3>
                                <p className="text-gray-500">Try broadening your search or clearing some criteria.</p>
                            </div>
                        )}

                        {/* Load More Trigger */}
                        {dealsResponse && dealsResponse.data.length > 0 && dealsResponse.data.length < dealsResponse.total && (
                            <div className="mt-12 flex justify-center">
                                <button className="bg-white border-2 border-[#b4a7d6] text-[#6a329f] hover:bg-[#6a329f] hover:text-white transition-all font-bold py-3 px-8 rounded-full shadow-sm flex items-center gap-2 group">
                                    Load More Deals
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TodaysDealsPage;
