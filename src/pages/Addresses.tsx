import { motion } from "framer-motion";
import { MapPin, Plus, Edit2, Trash2, Check, Home, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const addresses = [
  {
    id: 1,
    type: "home",
    label: "Home",
    name: "John Doe",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "+1 234 567 8900",
    isDefault: true
  },
  {
    id: 2,
    type: "office",
    label: "Office",
    name: "John Doe",
    address: "456 Business Ave, Floor 12",
    city: "New York",
    state: "NY",
    zip: "10018",
    phone: "+1 234 567 8901",
    isDefault: false
  }
];

const Addresses = () => {
  const handleSetDefault = (id: number) => {
    toast.success("Default address updated");
  };

  const handleDelete = (id: number) => {
    toast.success("Address deleted");
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Saved Addresses</h1>
              <p className="text-muted-foreground">Manage your delivery addresses</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Address Type</Label>
                    <RadioGroup defaultValue="home" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home" id="home" />
                        <Label htmlFor="home" className="flex items-center gap-2">
                          <Home className="h-4 w-4" /> Home
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="office" id="office" />
                        <Label htmlFor="office" className="flex items-center gap-2">
                          <Building className="h-4 w-4" /> Office
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+1 234 567 8900" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" placeholder="123 Main Street, Apt 4B" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="NY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="10001" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Save Address</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass-card ${address.isDefault ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          address.type === 'home' ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'
                        }`}>
                          {address.type === 'home' ? <Home className="h-6 w-6" /> : <Building className="h-6 w-6" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{address.label}</h3>
                            {address.isDefault && (
                              <Badge variant="secondary" className="gap-1">
                                <Check className="h-3 w-3" />
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground">{address.name}</p>
                          <p className="text-sm text-muted-foreground">{address.address}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} {address.zip}
                          </p>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Addresses;
