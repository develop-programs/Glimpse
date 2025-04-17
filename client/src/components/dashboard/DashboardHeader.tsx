import { motion } from "framer-motion";
import { SparklesIcon, HelpCircleIcon, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Notification from "./Features/Notification";
import Account from "./Features/Account";

const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-4"
    >
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-block mb-3 bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 px-4 py-1.5 rounded-full border border-primary/20 shadow-sm"
        >
          <span className="text-primary font-medium text-xs flex items-center">
            <SparklesIcon className="h-3.5 w-3.5 mr-1.5 text-blue-500 animate-pulse" />
            Video Conference Platform
          </span>
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-green-500 bg-clip-text text-transparent">Glimpse</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect with anyone, anywhere, anytime - Start your video call in seconds
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative border border-border">
              <HelpCircleIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align='end' className='max-w-lg'>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Need help?</h4>
              <div className="text-xs text-muted-foreground space-y-1.5">
                <p className="flex items-center">
                  <span className="bg-primary/10 text-primary size-5 grid place-content-center p-1 rounded-full mr-1.5">1</span>
                  Create or join a meeting
                </p>
                <p className="flex items-center">
                  <span className="bg-primary/10 text-primary size-5 grid place-content-center p-1 rounded-full mr-1.5">2</span>
                  Share your meeting ID
                </p>
                <p className="flex items-center">
                  <span className="bg-primary/10 text-primary size-5 grid place-content-center p-1 rounded-full mr-1.5">3</span>
                  Adjust settings as needed
                </p>
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs mt-1">
                View Documentation
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative border border-border">
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
          <PopoverContent align='end' className='max-w-52'>
            <Account />
          </PopoverContent>
        </Popover>

      </div>
    </motion.div>
  );
};

export default DashboardHeader;
