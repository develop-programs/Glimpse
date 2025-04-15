import { motion } from "framer-motion";
import { SparklesIcon, HelpCircleIcon, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-4"
    >
      <div className="space-y-2">
        <div className="inline-block mb-3 bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full">
          <span className="text-primary font-medium text-xs flex items-center">
            <SparklesIcon className="h-3 w-3 mr-1" />
            Video Conference Platform
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-green-500 bg-clip-text text-transparent">Glimpse</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect with anyone, anywhere, anytime - Start your video call in seconds
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative border border-border">
          <HelpCircleIcon className="h-4 w-4" />
        </Button>


        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative border border-border">
              <BellIcon className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align='end' className='max-w-52'></PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-white dark:border-slate-800">
              <AvatarFallback className="bg-primary text-primary-foreground">US</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent align='end' className='max-w-52'></PopoverContent>
        </Popover>

      </div>
    </motion.div>
  );
};

export default DashboardHeader;
