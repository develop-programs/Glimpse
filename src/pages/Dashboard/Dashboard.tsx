"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { VideoIcon, LinkIcon } from "lucide-react";
// Dashboard Components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";
import RecentMeetings from "@/components/dashboard/RecentMeetings";
import MeetingStats from "@/components/dashboard/MeetingStats";
import TeamMembers from "@/components/dashboard/TeamMembers";
import QuickTips from "@/components/dashboard/QuickTips";
import GettingStarted from "@/components/dashboard/GettingStarted";
// Mock Data
import { gettingStartedSteps } from "@/data/mockdata";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import NewMeeting from '@/components/dashboard/Features/NewMeeting';
import Join from '@/components/dashboard/Features/Join';
import AiChat from '@/components/AiChat';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function DashboardPage() {
    const [showGettingStarted, setShowGettingStarted] = useState(true);
    const { user, isLoading, isAuthenticated } = useAuth();

    const navigate = useNavigate()

    if (!isAuthenticated) {
        navigate("/auth/login")
    }


    React.useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-300">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-24">
            <div className="container mx-auto max-w-7xl py-6 px-4">
                <div className="space-y-5">
                    {/* Dashboard Header */}
                    <DashboardHeader />

                    {/* Welcome message with user name */}
                    {user && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-600 dark:text-slate-300"
                        >
                            Welcome back, <span className="font-medium text-primary">{user && user.username}</span>! Your workspace is ready.
                        </motion.p>
                    )}

                    {/* Main Call-to-Action */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-gradient-to-r from-blue-400 via-blue-500 to-green-500 rounded-xl p-6 text-white shadow-lg mb-2"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-xl md:text-2xl font-bold">Connect instantly with your team</h2>
                                <p className="text-white/80 mt-1 text-sm md:text-base">Start a secure video meeting with just one click</p>
                            </div>
                            <div className="flex space-x-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="lg"
                                            variant="secondary"
                                            className="bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm text-white border-0"
                                        >
                                            <LinkIcon className="h-4 w-4 mr-2" /> Join Meeting
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md w-full">
                                        <Join />
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="lg"
                                            className="bg-white hover:bg-white/90 text-primary border-0 shadow-md"
                                        >
                                            <VideoIcon className="h-4 w-4 mr-2" /> New Meeting
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md w-full">
                                        <NewMeeting />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </motion.div>

                    {/* Getting Started (for new users) */}
                    {showGettingStarted && (
                        <GettingStarted steps={gettingStartedSteps} onDismiss={() => setShowGettingStarted(false)} />
                    )}

                    {/* Main Dashboard Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
                        {/* Left Column - Full width on small screens, 8/12 on large screens */}
                        <motion.div
                            className="col-span-1 lg:col-span-8 space-y-4 md:space-y-5"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            {/* Quick Actions */}
                            <div className="w-full overflow-x-auto">
                                <QuickActions />
                            </div>

                            {/* Upcoming Meetings */}
                            <div className="w-full overflow-x-auto">
                                <UpcomingMeetings />
                            </div>

                            {/* Recent Meetings */}
                            <div className="w-full overflow-x-auto">
                                <RecentMeetings />
                            </div>
                        </motion.div>

                        {/* Right Column - Full width on small screens, 4/12 on large screens */}
                        <motion.div
                            className="col-span-1 lg:col-span-4 space-y-4 md:space-y-5"
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            {/* Meeting Stats */}
                            <div className="w-full">
                                <MeetingStats />
                            </div>

                            {/* Team Members */}
                            <div className="w-full">
                                <TeamMembers />
                            </div>

                            {/* Help & Tips */}
                            <div className="w-full">
                                <QuickTips />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <AiChat />
        </div>
    );
}