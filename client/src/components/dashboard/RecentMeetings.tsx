
import { motion } from "framer-motion";
import { HistoryIcon, ClockIcon, CalendarIcon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { recentMeetings } from "@/data/mockdata";

const RecentMeetings = () => {
  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-white to-sky-50/50 dark:from-slate-800 dark:to-slate-800/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base text-blue-700 dark:text-blue-300">
            <HistoryIcon className="h-4 w-4 mr-2 text-sky-500" />
            Recent Meetings
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentMeetings.map((meeting, i) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="p-3 rounded-md hover:bg-sky-50/80 dark:hover:bg-slate-800/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-sky-400/20 to-blue-500/20 text-blue-500 text-xs">
                    {meeting.title.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{meeting.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1 text-blue-400" /> {meeting.duration}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1 text-blue-400" /> {meeting.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-blue-100 text-blue-600 hover:bg-blue-50 dark:border-slate-700">
                      <PlayIcon className="h-3.5 w-3.5 mr-1" /> Replay
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Watch meeting recording</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMeetings;
