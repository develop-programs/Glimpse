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
import { Check, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Form validation schema
const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function Contact() {
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <div className="min-h-screen bg-[url('/patterns/grid-light.svg')] dark:bg-[url('/patterns/grid-dark.svg')] bg-fixed bg-white dark:bg-slate-950">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/95 to-blue-50/80 dark:from-slate-950/80 dark:via-slate-900/95 dark:to-blue-950/80 backdrop-blur-[2px] -z-10"></div>

            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20">
                {/* Decorative elements */}
                <div className="absolute top-20 left-1/3 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-1/3 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <motion.div
                    className="container relative z-10 mx-auto max-w-4xl text-center px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <motion.div
                        className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 text-blue-600 dark:text-blue-300 text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] font-medium mb-6 shadow-sm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" /> We're here to help
                    </motion.div>
                    <h1 className="text-[clamp(2.5rem,2rem+2.5vw,4rem)] font-extrabold tracking-tight mb-6">
                        Get in <motion.span
                            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 bg-clip-text text-transparent relative"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Touch
                            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transform"></span>
                        </motion.span>
                    </h1>
                    <motion.p
                        className="text-[clamp(1rem,0.95rem+0.5vw,1.25rem)] text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                    >
                        Questions, feedback, or just want to say hello? Our team is ready to hear from you and provide the support you need.
                    </motion.p>
                </motion.div>
            </section>

            {/* Main Content Section */}
            <section className="container mx-auto px-4 py-12 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                        {/* Contact Form */}
                        <motion.div
                            className="lg:col-span-7 order-2 lg:order-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
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
                        </motion.div>

                        {/* Contact Information Cards */}
                        <motion.div
                            className="lg:col-span-5 order-1 lg:order-2 space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                                <Card className="overflow-hidden border border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/30 backdrop-blur-md shadow-xl rounded-3xl group">
                                    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/10 to-transparent"></div>
                                    <CardContent className="p-[clamp(1.25rem,1rem+1vw,2rem)] relative">
                                        <div className="flex gap-5 items-start">
                                            <div className="bg-blue-100 dark:bg-blue-900/50 rounded-2xl p-4 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                <Mail className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-[clamp(1.1rem,1rem+0.5vw,1.25rem)] font-bold mb-3">Email Us</h3>
                                                <p className="text-[clamp(0.9rem,0.85rem+0.25vw,1rem)] text-slate-600 dark:text-slate-300 mb-5">Our team typically responds within 24 hours</p>
                                                <div className="font-medium text-blue-600 dark:text-blue-400 text-[clamp(0.875rem,0.825rem+0.25vw,0.95rem)] flex items-center gap-2 mb-1 group-hover:translate-x-1 transition-transform duration-200">
                                                    <span className="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
                                                    support@glimpse.app
                                                </div>
                                                <div className="font-medium text-blue-600 dark:text-blue-400 text-[clamp(0.875rem,0.825rem+0.25vw,0.95rem)] flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                                    <span className="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
                                                    sales@glimpse.app
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                                <Card className="overflow-hidden border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-white/90 to-indigo-50/90 dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-md shadow-xl rounded-3xl group">
                                    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-indigo-500/10 to-transparent"></div>
                                    <CardContent className="p-[clamp(1.25rem,1rem+1vw,2rem)] relative">
                                        <div className="flex gap-5 items-start">
                                            <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl p-4 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                <Phone className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-[clamp(1.1rem,1rem+0.5vw,1.25rem)] font-bold mb-3">Call Us</h3>
                                                <p className="text-[clamp(0.9rem,0.85rem+0.25vw,1rem)] text-slate-600 dark:text-slate-300 mb-5">Available Monday through Friday, 9am-6pm EST</p>
                                                <div className="font-medium text-indigo-600 dark:text-indigo-400 text-[clamp(0.875rem,0.825rem+0.25vw,0.95rem)] flex items-center gap-2 mb-1 group-hover:translate-x-1 transition-transform duration-200">
                                                    <span className="inline-block w-1 h-1 bg-indigo-500 rounded-full"></span>
                                                    +1 (555) 123-4567
                                                </div>
                                                <div className="font-medium text-indigo-600 dark:text-indigo-400 text-[clamp(0.875rem,0.825rem+0.25vw,0.95rem)] flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                                    <span className="inline-block w-1 h-1 bg-indigo-500 rounded-full"></span>
                                                    +1 (555) 987-6543
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                                <Card className="overflow-hidden border border-purple-100 dark:border-purple-900/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-slate-800/90 dark:to-purple-900/30 backdrop-blur-md shadow-xl rounded-3xl group">
                                    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-500/10 to-transparent"></div>
                                    <CardContent className="p-[clamp(1.25rem,1rem+1vw,2rem)] relative">
                                        <div className="flex gap-5 items-start">
                                            <div className="bg-purple-100 dark:bg-purple-900/50 rounded-2xl p-4 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                                <MapPin className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-[clamp(1.1rem,1rem+0.5vw,1.25rem)] font-bold mb-3">Visit Us</h3>
                                                <p className="text-[clamp(0.9rem,0.85rem+0.25vw,1rem)] text-slate-600 dark:text-slate-300 mb-5">Drop by our office for a coffee and chat</p>
                                                <div className="font-medium text-purple-600 dark:text-purple-400 text-[clamp(0.875rem,0.825rem+0.25vw,0.95rem)] flex items-center gap-2 mb-1 group-hover:translate-x-1 transition-transform duration-200">
                                                    <span className="inline-block w-1 h-1 bg-purple-500 rounded-full"></span>
                                                    123 Tech Avenue
                                                </div>
                                                <div className="font-medium text-purple-600 dark:text-purple-400 text-[clamp(0.875rem,0.825rem+0.25vw,0.95rem)] flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                                    <span className="inline-block w-1 h-1 bg-purple-500 rounded-full"></span>
                                                    San Francisco, CA 94107
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="container mx-auto px-4 py-16">
                <motion.div
                    className="max-w-7xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xl rounded-3xl p-[clamp(1.25rem,1rem+1vw,2rem)] mb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                            <h2 className="text-[clamp(1.5rem,1.25rem+1.25vw,2.25rem)] font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Come Visit Our Office</h2>
                            <div className="flex space-x-3 mt-4 md:mt-0">
                                <Button variant="outline" className="rounded-xl border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700 group">
                                    Get Directions
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </Button>
                                <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group">
                                    View Nearby Places
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                            <iframe
                                title="Glimpse Office Location"
                                className="w-full h-full"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.09854377458!2d-122.44271423526979!3d37.7596929559331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858081c252135f%3A0xcf7a42a208214668!2sSouth%20of%20Market%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1689786297302!5m2!1sen!2sus"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* FAQ/Support Section */}
            <section className="container mx-auto px-4 py-16 mb-16">
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-600 p-px shadow-xl">
                        <div className="bg-white dark:bg-slate-900 rounded-[1.4rem] p-[clamp(1.5rem,1.25rem+1.25vw,4rem)] text-center">
                            <motion.div
                                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 text-blue-600 dark:text-blue-300 text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] font-medium mb-6 shadow-sm"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <Check className="w-4 h-4 mr-2" /> Quick Support
                            </motion.div>
                            <h2 className="text-[clamp(1.75rem,1.5rem+1.25vw,3rem)] font-bold mb-6">Need help right away?</h2>
                            <p className="text-[clamp(1rem,0.95rem+0.5vw,1.25rem)] text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
                                Check out our comprehensive documentation and frequently asked questions for instant answers to common questions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-xl px-8 py-2 h-auto border-2 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20 text-[clamp(0.9rem,0.85rem+0.25vw,1.1rem)] group"
                                >
                                    View Documentation
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </Button>
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="rounded-xl px-8 py-2 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-700/20 text-[clamp(0.9rem,0.85rem+0.25vw,1.1rem)] group"
                                >
                                    Visit Support Center
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
