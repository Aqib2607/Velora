import { motion } from "framer-motion";
import { Truck, Globe, Clock, ShieldCheck, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Shipping Policy</h1>
            <p className="text-muted-foreground">Fast, reliable, and transparent shipping for everyone.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "Most orders arrive within 3-5 business days." },
              { icon: Globe, title: "Global Shipping", desc: "We ship to over 120 countries worldwide." },
              { icon: Clock, title: "Order Processing", desc: "Orders are processed within 24 hours." },
              { icon: ShieldCheck, title: "Insured Shipping", desc: "All packages are fully insured against loss or damage." }
            ].map((item, i) => (
              <Card key={item.title} className="glass-card">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-card mb-12">
            <CardHeader>
              <CardTitle>Shipping Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Standard (5-7 days)</TableHead>
                    <TableHead>Express (2-3 days)</TableHead>
                    <TableHead>Free Shipping On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { region: "Domestic (US)", std: "$5.99", exp: "$14.99", free: "Orders over $50" },
                    { region: "Canada & Mexico", std: "$12.99", exp: "$24.99", free: "Orders over $100" },
                    { region: "Europe", std: "$14.99", exp: "$29.99", free: "Orders over $120" },
                    { region: "Asia / Australia", std: "$19.99", exp: "$39.99", free: "Orders over $150" },
                    { region: "Rest of World", std: "$24.99", exp: "$49.99", free: "Orders over $200" }
                  ].map((row) => (
                    <TableRow key={row.region}>
                      <TableCell className="font-medium">{row.region}</TableCell>
                      <TableCell>{row.std}</TableCell>
                      <TableCell>{row.exp}</TableCell>
                      <TableCell>{row.free}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Delivery Areas</h2>
              <p className="text-muted-foreground leading-relaxed">
                We currently ship to most countries worldwide. However, due to certain restrictions, we are unable to ship to some regions.
                If you are unsure whether we ship to your location, please enter your address at checkout or contact our support team.
                Note that remote areas may require additional delivery time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Tracking Your Order</h2>
              <p className="text-muted-foreground leading-relaxed">
                Once your order has been shipped, you will receive a confirmation email with a tracking number.
                You can track your package by visiting our "Track Order" page or logging into your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Customs, Duties & Taxes</h2>
              <p className="text-muted-foreground leading-relaxed">
                International orders may be subject to import taxes, duties, and customs fees, which are levied once the package reaches the destination country.
                These charges are the recipient's responsibility. Velora has no control over these charges and cannot predict what they may be.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
