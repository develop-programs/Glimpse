import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Info, Users, VideoIcon } from 'lucide-react';
import { useAtom } from 'jotai';
import { recentMeetingsAtom } from '@/data/recentData';

export default function NewMeeting() {
    const [recentMeetings] = useAtom(recentMeetingsAtom);

    return (
        <div className="space-y-4">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold text-blue-600">Start a New Meeting</DialogTitle>
            </DialogHeader>

            <div className="flex items-center justify-center py-4">
                <div className="bg-blue-600 p-6 rounded-full">
                    <VideoIcon className="h-12 w-12 text-white" />
                </div>
            </div>

            <div className="grid gap-3">
                <Button
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-lg font-medium"
                    onClick={() => console.log("Starting instant meeting")}
                >
                    Start Instant Meeting
                </Button>
            </div>

            {recentMeetings.length > 0 && (
                <div className="border-t pt-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Recent Meetings
                    </h4>
                    <div className="space-y-2">
                        {recentMeetings.slice(0, 2).map(meeting => (
                            <div
                                key={meeting.id}
                                className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                                onClick={() => console.log(`Joining meeting: ${meeting.id}`)}
                            >
                                <div>
                                    <p className="text-sm font-medium">{meeting.name}</p>
                                    <p className="text-xs text-muted-foreground">{meeting.date}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-md">
                                    <Users className="h-3 w-3 text-blue-500" />
                                    <span className="text-xs text-blue-600 dark:text-blue-400">{meeting.participants}</span>
                                    <Button variant="outline" size="sm">Join</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <DialogFooter className="flex justify-between items-center pt-2 border-t mt-3">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs">
                    <Info className="h-3 w-3" />
                    End-to-end encrypted
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-600"
                    onClick={() => console.log("Opening settings")}
                >
                    Settings
                </Button>
            </DialogFooter>
        </div>
    );
}
