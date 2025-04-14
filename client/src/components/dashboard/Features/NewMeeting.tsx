import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from "motion/react"
import { Clock, Info, Users, VideoIcon } from 'lucide-react';
import { useAtom } from 'jotai';
import { recentMeetingsAtom } from '@/data/recentData';

export default function NewMeeting() {
    const [recentMeetings] = useAtom(recentMeetingsAtom);
    return (
        <div className="space-y-5">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Start a New Meeting</DialogTitle>
            </DialogHeader>

            <div className="flex items-center justify-center py-8">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                    className="bg-gradient-to-r from-sky-500 to-blue-600 p-8 rounded-full shadow-lg shadow-blue-500/20"
                >
                    <VideoIcon className="h-16 w-16 text-white" />
                </motion.div>
            </div>

            <div className="grid gap-3">
                <motion.div whileTap={{ scale: 0.98 }}>
                    <Button className="w-full py-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-lg font-medium shadow-md">
                        Start Instant Meeting
                    </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full py-6 border-blue-200 text-blue-600 hover:bg-blue-50 text-lg font-medium">
                        With Meeting Link
                    </Button>
                </motion.div>
            </div>

            <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Recent Meetings
                </h4>
                <div className="space-y-2">
                    {recentMeetings.slice(0, 2).map(meeting => (
                        <motion.div
                            key={meeting.id}
                            whileHover={{ x: 5 }}
                            className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        >
                            <div>
                                <p className="text-sm font-medium">{meeting.name}</p>
                                <p className="text-xs text-muted-foreground">{meeting.date}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                                <Users className="h-3 w-3 text-blue-500" />
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{meeting.participants}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <DialogFooter className="mt-4 text-xs flex justify-between items-center pt-2 border-t">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Info className="h-3 w-3" />
                    End-to-end encrypted
                </div>
                <Button size="sm" variant="ghost" className="text-blue-600">Settings</Button>
            </DialogFooter >
        </div >
    );
}
