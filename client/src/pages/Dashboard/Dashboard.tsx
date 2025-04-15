"use client";
import { useState } from 'react';
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

export default function DashboardPage() {
    const [showGettingStarted, setShowGettingStarted] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto max-w-7xl py-6 px-4">
                <div className="space-y-5">
                    {/* Dashboard Header */}
                    <DashboardHeader />

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
                                    <DialogContent>
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
                                    <DialogContent>
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
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Left Column */}
                        <motion.div
                            className="md:col-span-8 space-y-5"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            {/* Quick Actions */}
                            <QuickActions />

                            {/* Upcoming Meetings */}
                            <UpcomingMeetings />

                            {/* Recent Meetings */}
                            <RecentMeetings />
                        </motion.div>

                        {/* Right Column */}
                        <motion.div
                            className="md:col-span-4 space-y-5"
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            {/* Meeting Stats */}
                            <MeetingStats />

                            {/* Team Members */}
                            <TeamMembers />

                            {/* Help & Tips */}
                            <QuickTips />
                        </motion.div>
                    </div>
                </div>
            </div>
            <AiChat />
        </div>
    );
}