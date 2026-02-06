import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground">We'd love to hear from you. Get in touch with us.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Phone, title: "Phone", value: "+1 (800) 123-4567", desc: "Mon-Fri 9am-6pm" },
              { icon: Mail, title: "Email", value: "support@nextgen.com", desc: "24/7 support" },
              { icon: MapPin, title: "Office", value: "New York, NY", desc: "123 Commerce St" }
            ].map((item, i) => (
              <Card key={item.title} className="glass-card text-center">
                <CardContent className="p-6">
                  <item.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-foreground">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="contact-name">Name</Label><Input id="contact-name" name="name" autoComplete="name" placeholder="John Doe" /></div>
                  <div className="space-y-2"><Label htmlFor="contact-email">Email</Label><Input id="contact-email" name="email" autoComplete="email" type="email" placeholder="john@example.com" /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="contact-subject">Subject</Label><Input id="contact-subject" name="subject" autoComplete="off" placeholder="How can we help?" /></div>
                <div className="space-y-2"><Label htmlFor="contact-message">Message</Label><Textarea id="contact-message" name="message" autoComplete="off" rows={5} placeholder="Your message..." /></div>
                <Button className="gap-2"><Send className="h-4 w-4" />Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
