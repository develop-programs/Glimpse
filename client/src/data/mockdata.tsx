import { VideoIcon, UsersIcon, CalendarIcon, ClockIcon, BarChart3Icon } from "lucide-react";

// Sample upcoming meetings data
export const upcomingMeetings = [
  {
    id: 1,
    title: "Weekly Team Sync",
    time: "Today, 2:00 PM",
    participants: 5
  },
  {
    id: 2,
    title: "Project Review",
    time: "Tomorrow, 10:30 AM",
    participants: 3
  },
  {
    id: 3,
    title: "Client Meeting",
    time: "Wed, 4:00 PM",
    participants: 8
  }
];

// Sample recent meetings data
export const recentMeetings = [
  {
    id: 101,
    title: "Product Demo",
    date: "Yesterday",
    duration: "45 min",
    participants: 4
  },
  {
    id: 102,
    title: "Marketing Strategy",
    date: "Jul 12",
    duration: "1h 15m",
    participants: 6
  },
  {
    id: 103,
    title: "Design Review",
    date: "Jul 10",
    duration: "30 min",
    participants: 3
  }
];

// Sample meeting metrics
export const meetingMetrics = [
  { title: "Total Meetings", value: 24, change: "+12%", icon: <VideoIcon className="h-4 w-4" /> },
  { title: "Meeting Hours", value: "32h", change: "+8%", icon: <ClockIcon className="h-4 w-4" /> },
  { title: "Participants", value: 86, change: "+15%", icon: <UsersIcon className="h-4 w-4" /> },
  { title: "Completion Rate", value: "94%", change: "+2%", icon: <BarChart3Icon className="h-4 w-4" /> },
];

// Getting started steps for new users
export const gettingStartedSteps = [
  { id: 1, title: "Create your first meeting", description: "Start a video call with your team in one click", icon: <VideoIcon className="h-5 w-5" />, action: "Start now", completed: false },
  { id: 2, title: "Invite team members", description: "Add colleagues to your workspace", icon: <UsersIcon className="h-5 w-5" />, action: "Invite", completed: false },
  { id: 3, title: "Schedule a meeting", description: "Plan ahead by setting up a future call", icon: <CalendarIcon className="h-5 w-5" />, action: "Schedule", completed: false },
];

// Team members data
export const teamMembers = [
  { id: 1, name: "Alex Kim", status: "Online", initial: "A" },
  { id: 2, name: "Taylor Wong", status: "Away", initial: "T" },
  { id: 3, name: "Jordan Smith", status: "In a meeting", initial: "J" }
];

// Quick tips data
export const quickTips = [
  "Press Spacebar to quickly mute/unmute during meetings",
  "Use Alt+V to toggle your camera on/off",
  "Share meeting links directly from the meeting screen"
];