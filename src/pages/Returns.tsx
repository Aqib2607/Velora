import { motion } from "framer-motion";
import { Package, RefreshCw, CheckCircle, Clock, AlertCircle, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Returns = () => {
    return (
        <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
                        <p className="text-muted-foreground">
                            We want you to love your purchase. If you're not satisfied, we're here to help.
                        </p>
                    </div>

                    {/* Return Policy Overview */}
                    <Card className="glass-card mb-8">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold mb-6">Our Return Policy</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { icon: Clock, title: "30-Day Window", desc: "Return items within 30 days of delivery" },
                                    { icon: Package, title: "Original Condition", desc: "Items must be unused and in original packaging" },
                                    { icon: RefreshCw, title: "Easy Process", desc: "Simple online return initiation" }
                                ].map((item) => (
                                    <div key={item.title} className="text-center">
                                        <item.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                                        <h3 className="font-semibold mb-2">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Return Process Steps */}
                    <Card className="glass-card mb-8">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold mb-6">How to Return an Item</h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        step: "1",
                                        title: "Initiate Your Return",
                                        desc: "Log in to your account, go to 'Orders', and select the item you wish to return. Click 'Request Return' and choose your reason."
                                    },
                                    {
                                        step: "2",
                                        title: "Print Return Label",
                                        desc: "Once approved, you'll receive a prepaid return shipping label via email. Print it out and attach it to your package."
                                    },
                                    {
                                        step: "3",
                                        title: "Ship Your Return",
                                        desc: "Drop off your package at any authorized shipping location. You'll receive a tracking number to monitor your return."
                                    },
                                    {
                                        step: "4",
                                        title: "Receive Your Refund",
                                        desc: "Once we receive and inspect your return, we'll process your refund within 5-7 business days to your original payment method."
                                    }
                                ].map((item) => (
                                    <div key={item.step} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Eligibility & Refund Info Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Eligibility Criteria */}
                        <Card className="glass-card">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                    <h2 className="text-xl font-bold">Eligible for Return</h2>
                                </div>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>Unopened and unused items in original packaging</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>Items with all original tags and accessories</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>Defective or damaged items (with photo proof)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>Wrong item received</span>
                                    </li>
                                </ul>

                                <div className="flex items-center gap-2 mb-4 mt-6">
                                    <AlertCircle className="h-6 w-6 text-red-500" />
                                    <h3 className="text-lg font-semibold">Not Eligible</h3>
                                </div>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span>Personal care items (for hygiene reasons)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span>Final sale or clearance items</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span>Gift cards and digital products</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span>Items returned after 30 days</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Refund Information */}
                        <Card className="glass-card">
                            <CardContent className="p-8">
                                <h2 className="text-xl font-bold mb-4">Refund Information</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Processing Time</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Refunds are processed within 5-7 business days after we receive and inspect your return.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Refund Method</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Refunds will be issued to your original payment method. Please allow 3-5 additional business days for the refund to appear in your account.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Shipping Costs</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Original shipping costs are non-refundable unless the return is due to our error (defective or wrong item).
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Exchanges</h3>
                                        <p className="text-sm text-muted-foreground">
                                            We don't offer direct exchanges. Please return the item for a refund and place a new order for the desired item.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Section */}
                    <Card className="glass-card">
                        <CardContent className="p-8 text-center">
                            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
                            <p className="text-muted-foreground mb-6">
                                Our customer service team is here to assist you with any questions about returns or refunds.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="default" className="gap-2">
                                    <Mail className="h-4 w-4" />
                                    Contact Support
                                </Button>
                                <Button variant="outline">View Order History</Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">
                                Email: returns@velora.com | Phone: +1 (800) 123-4567
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Returns;
