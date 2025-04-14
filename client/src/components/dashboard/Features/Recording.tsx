import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Disc } from "lucide-react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function Recording() {
  const recordingsList = [
    { id: 1, title: "Team Meeting", date: "Jul 12, 2023", duration: "32:45", participants: 8 },
    { id: 2, title: "Client Presentation", date: "Jul 10, 2023", duration: "48:12", participants: 12 },
    { id: 3, title: "Product Demo", date: "Jul 5, 2023", duration: "26:30", participants: 6 },
  ];

  return (
    <div className="space-y-5">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">View Recordings</DialogTitle>
      </DialogHeader>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {recordingsList.map(recording => (
          <motion.div
            key={recording.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: recording.id * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-900/50 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-blue-100 dark:bg-blue-900/50 p-3 shadow-inner">
                <Disc className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">{recording.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{recording.date}</span>
                  <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {recording.duration}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <Avatar key={i} className="w-6 h-6 border-2 border-background">
                    <AvatarFallback className="text-[10px] bg-gradient-to-r from-blue-400 to-sky-300 text-white">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {recording.participants > 3 && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] border-2 border-background text-blue-600 dark:text-blue-300 font-medium">
                    +{recording.participants - 3}
                  </div>
                )}
              </div>
              <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/50">
                Watch
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2">
          View All Recordings
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </Button>
      </div>
    </div>
  );
}
