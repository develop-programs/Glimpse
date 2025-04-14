import React from 'react';
import { motion } from "framer-motion";
import { CalendarIcon, ClockIcon, UsersIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { upcomingMeetings } from "@/data/mockdata";

const UpcomingMeetings = () => {
  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-white to-sky-50/50 dark:from-slate-800 dark:to-slate-800/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base text-blue-700 dark:text-blue-300">
            <CalendarIcon className="h-4 w-4 mr-2 text-sky-500" />
            Upcoming Meetings
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600 hover:text-blue-700">
            <PlusCircleIcon className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingMeetings.length > 0 ? (
          <ul className="space-y-2">
            {upcomingMeetings.map((meeting, index) => (
              <motion.li
                key={meeting.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (index + 1) }}
                className="rounded-md hover:bg-sky-50/80 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-start space-x-3 p-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400/20 to-blue-500/20 flex items-center justify-center text-sky-500">
                    <CalendarIcon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <p className="font-medium text-sm">{meeting.title}</p>
                    <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-3 pt-1">
                      <span className="flex items-center">
                        <ClockIcon className="mr-1 h-3 w-3 text-blue-400" />
                        {meeting.time}
                      </span>
                      <span className="flex items-center">
                        <UsersIcon className="mr-1 h-3 w-3 text-blue-400" />
                        {meeting.participants} participants
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs border-blue-100 text-blue-600 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800/80"
                    >
                      Details
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 text-xs bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-0"
                    >
                      Join
                    </Button>
                  </div>
                </div>
                {index < upcomingMeetings.length - 1 && <Separator className="my-1" />}
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="h-10 w-10 mx-auto text-blue-300 mb-3" />
            <h3 className="text-base font-medium">No upcoming meetings</h3>
            <p className="text-sm text-muted-foreground mt-1">Schedule your first meeting to get started</p>
            <Button variant="outline" className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-slate-700">
              <CalendarIcon className="h-4 w-4 mr-2" /> Schedule Meeting
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetings;
