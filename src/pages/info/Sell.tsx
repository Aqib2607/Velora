import InfoPageLayout from "@/layouts/InfoPageLayout";

const Sell = () => {
  return (
    <InfoPageLayout
      title="Sell on Velora"
      breadcrumb={[{ label: "Sell", href: "/sell" }]}
      subtitle="Reach millions of global customers and grow your business."
    >
      <section className="mt-8 space-y-12">

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">1. The Velora Seller Ecosystem</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Joining Velora transforms your business from a local player into a global entity instantly. Over 60% of our total merchandise volume comes from independent third-party sellers. We provide the highest-traffic storefront in the world, backed by unparalleled consumer trust. Whether you are a solo entrepreneur dropshipping goods or a massive consumer brand, our scalable platform provides the infrastructure needed to exponentially increase your revenue. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">2. Seamless Onboarding Process</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            We have streamlined the onboarding process to get your catalog live rapidly. The process involves creating a seller account, undergoing our automated identity verification, setting up your deposit methods, and importing your SKU catalog (either manually via our UI, via bulk CSV upload, or directly integrated through our REST APIs). Our Quick-Start guides get most sellers generating sales within 48 hours of approval. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">3. KYC & Compliance Requirements</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            To maintain the integrity of our marketplace and comply with global financial regulations, all sellers must complete the Know Your Customer (KYC) protocol. This requires submission of government-issued identification, business registration documents (for professional accounts), and valid tax information. We take data privacy seriously; securely processing and isolating this proprietary information utilizing bank-level encryption. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">4. Transparent Commission Rates</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Velora operates on a transparent referral fee model. You pay nothing until your item sells. Commission rates vary progressively strictly dependent on the product category (e.g., electronics carry different margins than apparel or jewelry). We provide a comprehensive fee calculator in the Seller Dashboard, ensuring you understand your exact margin profile prior to listing any inventory. There are no hidden fees or surprise charges. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">5. Payout Schedule & Cash Flow</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            We understand that predictable cash flow is the lifeblood of retail. Velora operates on a rolling 14-day payout schedule. Once an order is confirmed as shipped, the funds (minus commissions and any fulfillment fees) are held in your seller escrow account and automatically disbursed to your linked bank account via ACH or wire transfer at the end of the settlement period. High-volume, highly-rated sellers may qualify for accelerated daily payouts. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">6. Inventory Management & Fulfillment Options</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Sellers have total control over their logistics strategy. You can choose Fulfilled by Merchant (FBM), utilizing your own warehouses and preferred carriers to fulfill orders directly. Alternatively, you can leverage Fulfilled by Velora (FBV), sending your inventory to our global distribution centers. FBV handles picking, packing, shipping, and customer service, automatically qualifying your products for our premium, expedited Prime delivery tiers. We continuously strive to push the boundaries of innovation and user-centric design. Across our global regions, our teams are dedicated to optimizing performance, ensuring scalability, and delivering unparalleled value to both consumers and business partners. This relentless pursuit of excellence is embedded in our DNA, shaping every decision we make from infrastructure deployment architecture to customer success workflows. Operational transparency and trust form the bedrock of our marketplace. By maintaining stringent compliance frameworks and prioritizing data security, we empower our users to transact with confidence. Our long-term vision encompasses not just market leadership, but the creation of a sustainable, inclusive digital economy that benefits all stakeholders.
          </p>
        </div>

      </section>
    </InfoPageLayout>
  );
};

export default Sell;
