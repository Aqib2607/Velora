import { Link } from "react-router-dom";
import BackToTop from "./footer/BackToTop";
import FooterColumn from "./footer/FooterColumn";
import RegionSelector from "./footer/RegionSelector";
import EcosystemGrid from "./footer/EcosystemGrid";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const footerColumnsData = [
    {
      title: t('footer.get_to_know'),
      links: [
        { label: t('footer.careers'), href: "/careers" },
        { label: t('footer.blog'), href: "/blog" },
        { label: t('footer.about'), href: "/about" },
        { label: t('footer.investor_relations'), href: "/investor-relations" },
        { label: t('footer.technology'), href: "/technology" },
        { label: t('footer.velora_science'), href: "/velora-science" }
      ]
    },
    {
      title: t('footer.make_money'),
      links: [
        { label: t('footer.sell_products'), href: "/sell" },
        { label: t('footer.sell_business'), href: "/sell-business" },
        { label: t('footer.advertise'), href: "/advertise" },
        { label: t('footer.affiliate'), href: "/affiliate" },
        { label: t('footer.self_publish'), href: "/self-publish" },
        { label: t('footer.pickup_hub'), href: "/pickup-hub" }
      ]
    },
    {
      title: t('footer.payment_products'),
      links: [
        { label: t('footer.business_card'), href: "/business-card" },
        { label: t('footer.shop_points'), href: "/shop-with-points" },
        { label: t('footer.reload_balance'), href: "/reload-balance" },
        { label: t('footer.currency_converter'), href: "/currency-converter" }
      ]
    },
    {
      title: t('footer.help'),
      links: [
        { label: t('footer.your_account'), href: "/account" },
        { label: t('footer.your_orders'), href: "/info/orders" },
        { label: t('footer.shipping_policies'), href: "/shipping" },
        { label: t('footer.returns_refunds'), href: "/returns" },
        { label: t('footer.help_center'), href: "/help" }
      ]
    }
  ];

  const legalLinks = [
    { label: t('footer.conditions_of_use'), href: "/conditions" },
    { label: t('footer.privacy_notice'), href: "/privacy" },
    { label: t('footer.data_disclosure'), href: "/data-disclosure" },
    { label: t('footer.your_ads_privacy_choices'), href: "/ad-preferences" }
  ];

  return (
    <footer className="w-full bg-background mt-auto font-sans">
      <BackToTop />

      <div className="bg-card w-full">
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {footerColumnsData.map((col) => (
              <FooterColumn key={col.title} title={col.title} links={col.links} />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <RegionSelector />
        </div>
      </div>

      <EcosystemGrid />

      <div className="bg-surface w-full py-8 border-t border-border flex flex-col items-center justify-center space-y-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4">
          {legalLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.href}
                className="text-xs font-medium text-foreground hover:underline hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <span className="text-xs text-muted-foreground">
          {t('footer.copyright')}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
