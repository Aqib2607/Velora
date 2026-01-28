import { motion } from "framer-motion";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminSettings() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Global Settings</h1>
                    <p className="text-muted-foreground">Manage application configuration</p>
                </div>
                <Button className="gradient-bg">
                    <Save className="h-4 w-4 mr-2" /> Save Changes
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
                            <Label>Site Name</Label>
                            <Input defaultValue="Velora" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Support Email</Label>
                            <Input defaultValue="support@velora.com" />
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
                                <Label className="text-base">Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">Disable the site for visitors</p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Vendor Registration</Label>
                                <p className="text-sm text-muted-foreground">Allow new vendors to sign up</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
