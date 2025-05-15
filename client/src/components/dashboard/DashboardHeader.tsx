import { motion } from "framer-motion";
import { SparklesIcon, HelpCircleIcon, BellIcon, User, Home, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Notification from "./Features/Notification";
import Account from "./Features/Account";

// Animation variants for consistent animations
const fadeInAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const scaleInAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
};

// Help content component for reuse
const HelpContent = () => (
  <div className="space-y-3">
    {[
      {
        step: 1,
        title: "Create or join a meeting",
        description: "Start a new video call or join with an existing code"
      },
      {
        step: 2,
        title: "Share your meeting ID",
        description: "Invite participants by sharing your meeting code"
      },
      {
        step: 3,
        title: "Adjust settings as needed",
        description: "Customize your video, audio and other preferences"
      }
    ].map(item => (
      <div key={item.step} className="bg-muted/50 p-3 rounded-lg flex items-start">
        <span className="bg-primary/20 text-primary size-6 grid place-content-center p-1 rounded-full mr-2 mt-0.5">
          {item.step}
        </span>
        <div>
          <h4 className="font-medium text-sm">{item.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
        </div>
      </div>
    ))}
  </div>
);

// Header banner with logo and welcome text
const HeaderBanner = () => (
  <div className="space-y-1 md:space-y-2">
    <motion.div
      {...scaleInAnimation}
      className="inline-block mb-2 md:mb-3 px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-primary/20 shadow-sm"
    >
      <span className="text-primary font-medium text-[10px] md:text-xs flex items-center">
        <SparklesIcon className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5 text-blue-500 animate-pulse" />
        Video Conference Platform
      </span>
    </motion.div>
    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
      Welcome to <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-green-500 bg-clip-text text-transparent">Glimpse</span>
    </h1>
    <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">
      Connect with anyone, anywhere, anytime - Start your video call in seconds
    </p>
  </div>
);

// Desktop header controls
const DesktopControls = () => (
  <div className="hidden md:flex items-center gap-3">
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative border border-border size-9">
          <HelpCircleIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end'>
        <div className="space-y-3">
          <h4 className="font-medium">Need help?</h4>
          <HelpContent />
          <Button size="sm" variant="outline" className="w-full mt-1">
            View Documentation
          </Button>
        </div>
      </PopoverContent>
    </Popover>

    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative border border-border h-9 w-9">
          <BellIcon className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='max-w-xl'>
        <Notification />
      </PopoverContent>
    </Popover>

    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer border-2 border-white dark:border-slate-800">
          <AvatarFallback className="bg-primary text-primary-foreground">US</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent align='end'>
        <Account />
      </PopoverContent>
    </Popover>
  </div>
);

// Mobile bottom navigation bar
const MobileBottomNav = () => (
  <div className="fixed w-full -bottom-5 left-0 z-50 bg-background">
    <div className="flex justify-around items-center py-4 px-2">
      <NavButton icon={<Home className="size-5 mb-1" />} label="Home" />
      <NavButton icon={<Video className="size-5 mb-1" />} label="Meetings" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center h-full rounded-none relative">
            <BellIcon className="size-5 mb-1" />
            <span className="absolute -top-2 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
            <span className="text-[10px]">Alerts</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="center" className="w-screen max-w-[300px] mb-2">
          <Notification />
        </PopoverContent>
      </Popover>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center h-full rounded-none">
            <User className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Profile</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] sm:w-[350px] px-4">
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">User Account</h3>
            <Account />
          </div>

          <div className="py-4 mt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Help Center</h3>
            <HelpContent />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </div>
);

// Reusable navigation button for mobile nav
interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
}

const NavButton = ({ icon, label }: NavButtonProps) => (
  <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center h-full rounded-none">
    {icon}
    <span className="text-[10px]">{label}</span>
  </Button>
);

const DashboardHeader = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <>
      <motion.div
        {...fadeInAnimation}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 mt-3 mb-4"
      >
        <HeaderBanner />
        <DesktopControls />
      </motion.div>

      {isMobile && <MobileBottomNav />}
    </>
  );
};

export default DashboardHeader;
