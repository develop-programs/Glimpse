
import { motion } from "framer-motion";
import { VideoIcon, LinkIcon, CalendarIcon, Disc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import NewMeeting from './Features/NewMeeting';
import Join from "./Features/Join";
import Schedule from "./Features/Schedule";
import Recording from "./Features/Recording";

export default function QuickActions() {
  const actions = [
    {
      id: 'new',
      label: 'New Meeting',
      icon: <VideoIcon className="h-4 w-4" />,
      variant: 'default' as const,
      description: 'Start a video call instantly',
    },
    {
      id: 'join',
      label: 'Join Meeting',
      icon: <LinkIcon className="h-4 w-4" />,
      variant: 'outline' as const,
      description: 'Enter a meeting code',
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <CalendarIcon className="h-4 w-4" />,
      variant: 'outline' as const,
      description: 'Plan a future meeting',
    },
    {
      id: 'media',
      label: 'Recordings',
      icon: <Disc className='size-4' />,
      variant: 'outline' as const,
      description: 'Manage your recordings',
    },
  ];

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actions.map((action) => (
            <Dialog key={action.id}>
              <DialogTrigger asChild>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 1 }}
                  id={action.id}
                  className="flex items-center justify-center"
                >
                  <Button
                    variant={action.variant}
                    className={`w-full h-auto py-4 text-sm flex flex-col items-center gap-1 ${action.variant === 'default' ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                  >
                    <motion.div
                      className={`h-10 w-10 rounded-full ${action.variant === 'default' ? 'bg-white/20' : 'bg-primary/10'} flex items-center justify-center mb-1`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {action.icon}
                    </motion.div>
                    <span>{action.label}</span>
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent>
                {(() => {
                  switch (action.id) {
                    case 'new': return <NewMeeting />;
                    case 'join': return <Join />;
                    case 'schedule': return <Schedule />;
                    case 'media': return <Recording />;
                    default: return null;
                  }
                })()}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
