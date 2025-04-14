import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Clock } from 'lucide-react';
import { recentMeetingsAtom } from '@/data/recentData';
import { useAtom } from 'jotai';


export default function Join() {
  const [recentMeetings] = useAtom(recentMeetingsAtom);
  return (
    <div className="space-y-5">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Join Meeting</DialogTitle>
      </DialogHeader>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid gap-4 py-5"
      >
        <div className="grid gap-2">
          <Label htmlFor="meeting-code" className="text-sm font-medium">Meeting Code</Label>
          <Input id="meeting-code" placeholder="Enter meeting code" className="text-center text-xl tracking-wider py-6 border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div className="grid gap-2 mt-2">
          <Label htmlFor="display-name" className="text-sm font-medium">Your Name</Label>
          <Input id="display-name" placeholder="How others will see you" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
        </div>
      </motion.div >

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button className="w-full py-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-lg font-medium shadow-md">
          Join Now
        </Button>
      </motion.div >

      <div className="mt-6 border-t pt-4">
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          Recently Joined
        </h4>
        <div className="space-y-2">
          {recentMeetings.slice(0, 2).map(meeting => (
            <motion.div
              key={meeting.id}
              whileHover={{ x: 5 }}
              className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div>
                <p className="text-sm font-medium">{meeting.name}</p>
                <p className="text-xs text-muted-foreground">{meeting.date}</p>
              </div>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">Join</Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div >
  );
}
