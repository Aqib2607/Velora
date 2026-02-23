import InfoPageLayout from "@/layouts/InfoPageLayout";
import { useRegionStore } from "@/store/useRegionStore";

const Shipping = () => {
  const { shippingRegion } = useRegionStore();
  return (
    <InfoPageLayout
      title="Shipping & Fulfillment Policies"
      breadcrumb={[{ label: "Shipping", href: "/shipping" }]}
      subtitle="Speed, reliability, and global logistics options."
    >
      <section className="mt-8 space-y-12">

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">1. Comprehensive Shipping Overview: {shippingRegion}</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Velora’s logistics network is currently optimized to deliver products directly to your location in <strong>{shippingRegion}</strong>. Whether an item is fulfilled directly by an independent seller or dispatched from one of our massive automated distribution centers, our checkout system provides dynamic, highly accurate delivery estimates based on real-time inventory staging and carrier capacities. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">2. Velora Prime Fulfillment Network</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Products bearing the 'Prime' badge are stored, picked, packed, and shipped entirely by the Velora Fulfillment Network (FBV). This premium logistics tier guarantees expedited shipping options—often providing free one-day or same-day delivery in select metropolitan locales. We utilize proprietary routing algorithms and a massive fleet of dedicated air and ground transport to bypass traditional postal bottlenecks. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">3. Seller-Fulfilled Shipping Models</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Many of our independent merchants choose to fulfill orders directly from their own warehouses (Fulfilled by Merchant - FBM). To maintain our strict standards, active FBM sellers must adhere to rigorous performance metrics, including on-time shipment rates (minimum 99%) and valid tracking upload requirements. We provide sellers access to subsidized shipping labels through partnerships with major global carriers like UPS, FedEx, and DHL. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">4. Region-Based Shipping Rates</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Shipping costs are dynamically calculated during the checkout process based on the dimensional weight of the cargo, the origin warehouse, and the final destination zone. Customers can choose between standard, expedited, and priority delivery tiers. Our unified shopping cart system intuitively groups items originating from the same fulfillment center to minimize packaging waste and consolidate shipping charges for end consumers. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">5. International & Cross-Border Logistics</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Velora Global bridges the gap between international sellers and buyers. For eligible cross-border purchases, we simplify the complex logistics of international trade. Our Velora Global Export service handles end-to-end transport, integrating predictive transit times and providing full visibility tracking across international frontiers and multiple carrier handoffs, ensuring a seamless experience regardless of geographical distance. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">6. Customs, Duties & Import Policies</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Navigating international customs can be daunting. Velora’s Import Fees Deposit program estimates and collects applicable customs duties, taxes, and import fees during checkout. We then authorize our logistics carriers to clear customs on your behalf, preventing unexpected courier holding fees upon delivery. If the actual customs costs are lower than the deposit, the difference is automatically refunded to the original payment method. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

      </section>
    </InfoPageLayout>
  );
};

export default Shipping;
