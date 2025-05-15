import { atom } from "jotai";
import { Video, Calendar, Shield, Users, Star, Clock, Globe, Zap, MessageSquare, Share2, FileText, Headphones } from "lucide-react";

interface FeatureItem {
  icon: React.JSX.Element;
  title: string;
  description: string;
}

interface FeatureSection {
  title: string;
  icon: React.JSX.Element;
  heading: string;
  description: string;
  color: string;
  items: FeatureItem[];
}

interface FeatureData {
  free: FeatureSection;
  premium: {
    title: string;
    icon: React.JSX.Element;
    heading: string;
    description: string;
    color: string;
    previewItems: FeatureItem[];
  };
}

export const featureData = atom<FeatureData>(
  {
    free: {
      title: "Free Features",
      icon: <Zap className="w-4 h-4 mr-2" />,
      heading: "Start with powerful basics",
      description: "Begin your journey with our feature-rich free plan",
      color: "emerald",
      items: [
        {
          icon: <Video className="h-6 w-6 text-emerald-600" />,
          title: "Basic Video Conferencing",
          description: "Host meetings with up to 40 minutes duration for free",
        },
        {
          icon: <MessageSquare className="h-6 w-6 text-emerald-600" />,
          title: "In-Meeting Chat",
          description: "Send messages to participants during your call",
        },
        {
          icon: <Share2 className="h-6 w-6 text-emerald-600" />,
          title: "Screen Sharing",
          description: "Present your screen to all meeting participants",
        },
      ],
    },
    premium: {
      title: "Premium Features",
      icon: <Star className="w-4 h-4 mr-2" />,
      heading: "Everything you need for better meetings",
      description:
        "Powerful tools designed to make your video conferences more productive and engaging",
      color: "blue",
      previewItems: [
        {
          icon: <Video className="h-6 w-6 text-blue-600" />,
          title: "HD Video & Audio",
          description:
            "Crystal clear communication with adaptive quality for any connection",
        },
        {
          icon: <Shield className="h-6 w-6 text-blue-600" />,
          title: "Bank-Level Security",
          description:
            "End-to-end encryption and meeting passwords for complete privacy",
        },
        {
          icon: <Calendar className="h-6 w-6 text-blue-600" />,
          title: "Smart Scheduling",
          description: "Seamless calendar integration with automated reminders",
        },
        {
          icon: <Globe className="h-6 w-6 text-green-600" />,
          title: "Cross-Platform",
          description:
            "Works on all devices including mobile, tablet, and desktop",
        },
        {
          icon: <Users className="h-6 w-6 text-green-600" />,
          title: "Breakout Rooms",
          description:
            "Split meetings into smaller groups for focused discussions",
        },
        {
          icon: <Clock className="h-6 w-6 text-green-600" />,
          title: "Meeting Recording",
          description: "Record and share meetings with cloud storage integration",
        },
        {
          icon: <FileText className="h-6 w-6 text-blue-600" />,
          title: "Meeting Transcription",
          description:
            "Automatic speech-to-text conversion for all your meetings",
        },
        {
          icon: <Headphones className="h-6 w-6 text-green-600" />,
          title: "Virtual Background",
          description:
            "Professional backgrounds to maintain privacy and professionalism",
        },
        {
          icon: <Users className="h-6 w-6 text-blue-600" />,
          title: "Unlimited Participants",
          description:
            "Host meetings with as many people as needed without restrictions",
        },
      ],
    },
  }
)
