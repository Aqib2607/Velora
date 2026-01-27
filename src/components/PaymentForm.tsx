import { FormEvent, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

interface PaymentFormProps {
    clientSecret: string;
    onSuccess: (paymentIntent: any) => void;
}

export default function PaymentForm({ clientSecret, onSuccess }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required", // Handle redirects manual or auto
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Payment Failed",
                description: error.message || "An unexpected error occurred.",
            });
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Success
            onSuccess(paymentIntent);
        } else {
            // Processing or other status
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <Button type="submit" disabled={!stripe || isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pay Now
            </Button>
        </form>
    );
}
