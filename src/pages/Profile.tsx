import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit2, Camera, Shield, Bell, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

// Schema for Profile Update
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", phone: "", bio: "" }
  });

  // Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user"); // Matches GET /user endpoint
        const userData = response.data.data;
        setUser(userData);
        form.reset({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "",
          bio: userData.bio || ""
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: "Could not load user data."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [toast, form]);

  // Handle Profile Update
  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const response = await api.put("/user/profile", data);
      setUser(response.data.data); // Update local state
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your information has been saved."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.response?.data?.message || "Could not save changes."
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Avatar Upload
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // Show loading toast or state if desired
      toast({ title: "Uploading avatar...", description: "Please wait." });

      const response = await api.post("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Update local user state with new avatar URL
      if (user) {
        setUser({ ...user, avatar_url: response.data.data.avatar_url });
      }

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been changed."
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.response?.data?.message || "Could not upload image."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <img
                    src={user.avatar_url || "https://github.com/shadcn.png"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20 aspect-square"
                  />
                  <Label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <Input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </Label>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <Button
                  variant={isEditing ? "secondary" : "outline"}
                  className="gap-2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="h-4 w-4" />
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="glass-card w-full justify-start gap-2 p-2 overflow-x-auto">
              <TabsTrigger value="personal" className="gap-2">
                <User className="h-4 w-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="payment" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            {...form.register("name")}
                            className="pl-10"
                            disabled={!isEditing}
                          />
                        </div>
                        {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            {...form.register("email")}
                            className="pl-10"
                            disabled={!isEditing}
                          />
                        </div>
                        {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            {...form.register("phone")}
                            className="pl-10"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <div className="relative">
                          {/* Using Input as textarea replacement for now to keep style consistent, or update to Textarea */}
                          <Input
                            id="bio"
                            {...form.register("bio")}
                            className="pl-3"
                            disabled={!isEditing}
                            placeholder="Tell us about yourself"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              {/* Static Security Content - Future Step */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">Security settings will be implemented in a future update.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              {/* Static Notifications Content - Future Step */}
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Notification settings coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              {/* Static Payment Content - Future Step */}
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Payment methods coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
