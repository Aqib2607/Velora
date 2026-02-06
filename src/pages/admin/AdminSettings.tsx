import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Save, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSettings() {
    // State management for all form fields
    const [siteName, setSiteName] = useState("Velora");
    const [supportEmail, setSupportEmail] = useState("");
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [vendorRegistration, setVendorRegistration] = useState(true);
    const [chatbotApiKey, setChatbotApiKey] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/admin/settings");
            const data = res.data.data; // Expecting flat key-value pair

            if (data) {
                if (data.site_name) setSiteName(data.site_name);
                if (data.support_email) setSupportEmail(data.support_email);
                if (data.maintenance_mode) setMaintenanceMode(data.maintenance_mode === "1" || data.maintenance_mode === true);
                if (data.vendor_registration) setVendorRegistration(data.vendor_registration === "1" || data.vendor_registration === true);
                if (data.chatbot_api_key) setChatbotApiKey(data.chatbot_api_key);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load settings"
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Save handler
    const handleSave = async () => {
        setIsSaving(true);
        const settings = [
            { key: "site_name", value: siteName, group: "general" },
            { key: "support_email", value: supportEmail, group: "general" },
            { key: "maintenance_mode", value: maintenanceMode, group: "system", type: "boolean" },
            { key: "vendor_registration", value: vendorRegistration, group: "system", type: "boolean" },
            { key: "chatbot_api_key", value: chatbotApiKey, group: "chatbot" },
        ];

        try {
            await api.put("/admin/settings", { settings });
            toast({
                title: "Success",
                description: "Settings saved successfully!"
            });
        } catch (error) {
            console.error("Failed to save settings", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save settings'
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Global Settings</h1>
                    <p className="text-muted-foreground">Manage application configuration</p>
                </div>
                <Button className="gradient-bg" onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="grid gap-6">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>Basic site information and SEO settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="site-name">Site Name</Label>
                            <Input
                                id="site-name"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="support-email">Support Email</Label>
                            <Input
                                id="support-email"
                                type="email"
                                value={supportEmail}
                                onChange={(e) => setSupportEmail(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <CardTitle>Chatbot Configuration</CardTitle>
                        </div>
                        <CardDescription>Configure AI Chatbot settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="chatbot-api-key">API Key</Label>
                            <Input
                                id="chatbot-api-key"
                                type="password"
                                placeholder="sk-..."
                                value={chatbotApiKey}
                                onChange={(e) => setChatbotApiKey(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter your API key for the AI service. This is required for the chatbot to function.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Features & Toggles</CardTitle>
                        <CardDescription>Enable or disable global features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="maintenance-mode" className="text-base">Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">Disable the site for visitors</p>
                            </div>
                            <Switch
                                id="maintenance-mode"
                                checked={maintenanceMode}
                                onCheckedChange={setMaintenanceMode}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="vendor-registration" className="text-base">Vendor Registration</Label>
                                <p className="text-sm text-muted-foreground">Allow new vendors to sign up</p>
                            </div>
                            <Switch
                                id="vendor-registration"
                                checked={vendorRegistration}
                                onCheckedChange={setVendorRegistration}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
