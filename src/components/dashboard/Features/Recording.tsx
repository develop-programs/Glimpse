import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Disc, Clock, Download, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Recording() {
  const recordingsList = [
    { id: 1, title: "Team Meeting", date: "Jul 12, 2023", duration: "32:45", participants: 8 },
    { id: 2, title: "Client Presentation", date: "Jul 10, 2023", duration: "48:12", participants: 12 },
    { id: 3, title: "Product Demo", date: "Jul 5, 2023", duration: "26:30", participants: 6 },
  ];

  return (
    <div className="space-y-6 p-2">
      <DialogHeader className="pb-4 border-b border-blue-100 dark:border-blue-900/40">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <Disc className="h-6 w-6 text-blue-500" />
            <span>View Recordings</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Access and watch your previous meeting recordings
          </p>
        </motion.div>
      </DialogHeader>

      <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {recordingsList.map((recording, index) => (
          <motion.div
            key={recording.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/50 p-3 shadow-inner relative overflow-hidden group">
                <Disc className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:opacity-0 transition-opacity" />
                <Play className="h-6 w-6 text-blue-600 dark:text-blue-400 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p className="text-sm font-semibold">{recording.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{recording.date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {recording.duration}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[...Array(Math.min(3, recording.participants))].map((_, i) => (
                  <Avatar key={i} className="w-7 h-7 border-2 border-background transition-all hover:-translate-y-1">
                    <AvatarFallback className="text-[10px] bg-gradient-to-r from-blue-500 to-sky-400 text-white">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {recording.participants > 3 && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] border-2 border-background text-blue-600 dark:text-blue-300 font-medium transition-all hover:-translate-y-1">
                    +{recording.participants - 3}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 h-auto">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/50 transition-all">
                  <Play className="h-3.5 w-3.5 mr-1" /> Watch
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-8 flex justify-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2 font-medium">
          View All Recordings
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </Button>
      </motion.div>
    </div>
  );
}
