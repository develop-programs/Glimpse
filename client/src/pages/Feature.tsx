import React from 'react'
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
    Star, Video, Users, Clock, CheckCircle2, Shield, MonitorSmartphone, Headphones,
    PanelLeft, MessagesSquare, Share2, Gift, CloudLightning,
    Sparkles, LayoutGrid, Disc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from '@/layouts/MainLayout';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    isPro?: boolean;
}

const FeatureCard = ({ icon, title, description, isPro }: FeatureCardProps) => (
    <Card className="h-full border border-slate-100 hover:border-blue-300/30 transition-all duration-300 group">
        <CardContent className="p-5 md:p-6 h-full flex flex-col">
            <div className="flex flex-col space-y-3 h-full">
                <div className="p-3 rounded-xl bg-gradient-to-br from-sky-50 to-green-50 w-fit mb-4 border border-sky-200/20">
                    {icon}
                </div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    {isPro && (
                        <Badge variant="outline" className="bg-gradient-to-r from-blue-600 to-green-500 text-white border-0 ml-2">
                            PRO
                        </Badge>
                    )}
                </div>
                <p className="mt-2 text-muted-foreground">
                    {description}
                </p>
                <div className="h-1 w-12 bg-gradient-to-r from-blue-400/40 to-green-400/40 rounded-full mt-auto group-hover:w-24 transition-all duration-300"></div>
            </div>
        </CardContent>
    </Card>
);

type FeatureCategoryProps = {
    title: string;
    description: string;
    features: {
        icon: React.ReactNode;
        title: string;
        description: string;
        isPro?: boolean;
    }[];
};

const FeatureCategory = ({ title, description, features }: FeatureCategoryProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="py-12 md:py-24"
        >
            <div className="space-y-6 text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {title}
                </h2>
                <p className="text-lg text-muted-foreground">
                    {description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                        <FeatureCard {...feature} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default function Feature() {
    // Core meeting features
    const meetingFeatures = {
        title: "Powerful Meeting Tools",
        description: "Everything you need to conduct effective virtual meetings and boost team collaboration",
        features: [
            {
                icon: <Video className="h-6 w-6 text-blue-600" />,
                title: "Crystal-Clear Video",
                description: "High-definition video with adaptive quality that works even on slower connections"
            },
            {
                icon: <Users className="h-6 w-6 text-blue-600" />,
                title: "Breakout Rooms",
                description: "Split meetings into smaller groups for focused discussions and better collaboration",
                isPro: true
            },
            {
                icon: <Disc className="h-6 w-6 text-blue-600" />,
                title: "Meeting Recording",
                description: "Record and share meetings with cloud storage integration and automatic transcripts"
            },
            {
                icon: <Share2 className="h-6 w-6 text-blue-600" />,
                title: "Screen Sharing",
                description: "Share your entire screen or specific applications with annotation capabilities"
            },
            {
                icon: <Clock className="h-6 w-6 text-blue-600" />,
                title: "Smart Scheduling",
                description: "Easily plan meetings across time zones with calendar integration and reminders"
            },
            {
                icon: <CheckCircle2 className="h-6 w-6 text-blue-600" />,
                title: "Custom Backgrounds",
                description: "Use virtual backgrounds to maintain privacy or express your personality"
            },
        ]
    };

    // Security features
    const securityFeatures = {
        title: "Enterprise-Grade Security",
        description: "Keep your meetings and data safe with advanced security features",
        features: [
            {
                icon: <Shield className="h-6 w-6 text-green-600" />,
                title: "End-to-End Encryption",
                description: "Your conversations stay private with advanced 128-bit encryption technology"
            },
            {
                icon: <PanelLeft className="h-6 w-6 text-green-600" />,
                title: "Meeting Controls",
                description: "Waiting rooms, host controls, and participant management for secure meetings",
                isPro: true
            },
            {
                icon: <LayoutGrid className="h-6 w-6 text-green-600" />,
                title: "Custom Permissions",
                description: "Set granular permissions for participants to control access and actions"
            },
        ]
    };

    // Collaboration features
    const collaborationFeatures = {
        title: "Enhanced Collaboration",
        description: "Tools to make teamwork seamless and productive no matter where team members are located",
        features: [
            {
                icon: <MessagesSquare className="h-6 w-6 text-sky-600" />,
                title: "In-Meeting Chat",
                description: "Send messages, links and files to participants during meetings"
            },
            {
                icon: <Gift className="h-6 w-6 text-sky-600" />,
                title: "Reactions & Polls",
                description: "Express feedback with reactions and collect insights with interactive polls",
                isPro: true
            },
            {
                icon: <Sparkles className="h-6 w-6 text-sky-600" />,
                title: "Collaborative Whiteboard",
                description: "Brainstorm together with our intuitive digital whiteboard tool"
            },
        ]
    };

    // Platform features
    const platformFeatures = {
        title: "Cross-Platform Experience",
        description: "Use Glimpse seamlessly across all your devices and integrate with your favorite tools",
        features: [
            {
                icon: <MonitorSmartphone className="h-6 w-6 text-indigo-600" />,
                title: "Works Everywhere",
                description: "Access meetings from any device - desktop, tablet, or smartphone"
            },
            {
                icon: <CloudLightning className="h-6 w-6 text-indigo-600" />,
                title: "Calendar Integration",
                description: "Sync with Google Calendar, Outlook, and other popular calendar services",
                isPro: true
            },
            {
                icon: <Headphones className="h-6 w-6 text-indigo-600" />,
                title: "24/7 Support",
                description: "Get help when you need it with our dedicated customer support team"
            },
        ]
    };

    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-24 bg-gradient-to-b from-white via-sky-50/10 to-white">
                {/* Background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl -z-10"></div>

                <div className="container mx-auto text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-50 text-blue-600 text-sm font-medium mb-6 border border-sky-200/30">
                            <Star className="w-4 h-4 mr-2" /> Designed for productivity
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Features that make meetings <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">better</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Discover all the ways Glimpse helps teams connect, collaborate, and communicate more effectively
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 border-0">
                                <Link to="/signup" className="flex items-center">
                                    Get Started Free
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                <Link to="/contact-sales" className="flex items-center">
                                    Contact Sales
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6">
                {/* Main Feature Categories */}
                <FeatureCategory {...meetingFeatures} />
                <FeatureCategory {...securityFeatures} />
                <FeatureCategory {...collaborationFeatures} />
                <FeatureCategory {...platformFeatures} />

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="py-12 md:py-24 text-center"
                >
                    <div className="max-w-3xl mx-auto bg-gradient-to-br from-sky-400 via-blue-500 to-green-500 rounded-2xl p-10 text-white shadow-xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your meetings?</h2>
                        <p className="text-lg mb-8 text-white/90">
                            Join thousands of teams already using Glimpse to connect and collaborate
                        </p>
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                            <Link to="/signup" className="flex items-center">
                                Start Free Trial
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
}
