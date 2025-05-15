import { useState } from 'react';
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Send } from "lucide-react";

// Form validation schema
const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(values);
            setIsSuccess(true);
            form.reset();

            // Reset success state after 5 seconds
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xl rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 dark:from-blue-950/30 dark:to-slate-800/30"></div>
            <CardContent className="p-[clamp(1.5rem,1.25rem+1vw,2.5rem)] relative">
                <h2 className="text-[clamp(1.25rem,1.1rem+0.75vw,1.75rem)] font-bold mb-6 flex items-center">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Send us a message</span>
                </h2>

                {isSuccess && (
                    <motion.div
                        className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 text-green-800 dark:text-green-300"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="bg-green-100 dark:bg-green-800/50 p-2 rounded-full">
                            <Check className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-[clamp(0.875rem,0.825rem+0.25vw,1rem)]">Your message has been sent successfully!</span>
                    </motion.div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[clamp(0.8rem,0.75rem+0.25vw,0.9rem)] font-medium">Your Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl h-12 focus-visible:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[clamp(0.75rem,0.7rem+0.2vw,0.85rem)]" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[clamp(0.8rem,0.75rem+0.25vw,0.9rem)] font-medium">Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="john@example.com"
                                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl h-12 focus-visible:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[clamp(0.75rem,0.7rem+0.2vw,0.85rem)]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[clamp(0.8rem,0.75rem+0.25vw,0.9rem)] font-medium">Subject</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="How can we help you?"
                                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl h-12 focus-visible:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[clamp(0.75rem,0.7rem+0.2vw,0.85rem)]" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[clamp(0.8rem,0.75rem+0.25vw,0.9rem)] font-medium">Your Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={6}
                                            placeholder="Please describe how we can help you..."
                                            className="resize-none bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[clamp(0.75rem,0.7rem+0.2vw,0.85rem)]" />
                                </FormItem>
                            )}
                        />

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-semibold text-[clamp(0.9rem,0.85rem+0.25vw,1rem)] shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-700/20 transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Message...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
