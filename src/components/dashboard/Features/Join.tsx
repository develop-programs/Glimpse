import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Clock, Video, Users, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { recentMeetingsAtom } from '@/data/recentData';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '@/services/api';

export default function Join() {
  const [recentMeetings] = useAtom(recentMeetingsAtom);
  const [meetingCode, setMeetingCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Extract room ID from a meeting code or link
  const extractRoomId = (code: string) => {
    // If it's a full URL, extract the ID part
    if (code.includes('/room/')) {
      const parts = code.split('/room/');
      return parts[parts.length - 1].trim();
    }
    // Otherwise just return the code as is
    return code.trim();
  };

  const joinMeeting = async () => {
    if (!meetingCode || !displayName) {
      setError('Meeting code and your name are required');
      return;
    }

    const roomId = extractRoomId(meetingCode);
    if (!roomId) {
      setError('Invalid meeting code');
      return;
    }

    try {
      setIsJoining(true);
      setError(null);

      // Store the display name for use in the room
      localStorage.setItem('displayName', displayName);
      
      // Generate a temporary user ID for guest usage if one doesn't exist
      if (!localStorage.getItem('userId')) {
        const tempUserId = 'guest-' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('userId', tempUserId);
      }
      
      // Check if user is authenticated
      const token = localStorage.getItem('auth_token');
      
      // Function to check if token is valid (basic check)
      const isTokenValid = (token: string | null): boolean => {
        if (!token) return false;
        // Check if token has basic JWT structure
        const parts = token.split('.');
        return parts.length === 3;
      };
      
      if (token && isTokenValid(token)) {
        try {
          // If authenticated, try to join via API
          await api.rooms.join(roomId);
        } catch (apiError) {
          console.warn('API join failed, continuing as guest:', apiError);
          // Continue as guest if API call fails
        }
      }
      
      // Navigate to the room regardless of API call success
      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error('Error joining meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to join meeting. Please check your meeting code.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="space-y-6 p-2">
      <DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DialogTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Video className="h-6 w-6" />
            Join Meeting
          </DialogTitle>
        </motion.div>
      </DialogHeader>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-start gap-2"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-xl shadow-sm border border-blue-100 dark:border-slate-700"
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="meeting-code" className="text-sm font-medium flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-blue-500" /> Meeting Code
            </Label>
            <Input
              id="meeting-code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              placeholder="Enter code or link"
              className="text-center text-xl tracking-wider py-6 bg-white dark:bg-slate-800 border-blue-100 dark:border-slate-700 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display-name" className="text-sm font-medium">Your Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How others will see you"
              className="bg-white dark:bg-slate-800 border-blue-100 dark:border-slate-700 focus:ring-blue-400"
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-lg font-medium rounded-lg flex items-center justify-center gap-2 shadow-md transition-all"
              disabled={!meetingCode || !displayName || isJoining}
              onClick={joinMeeting}
            >
              {isJoining ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join Now
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {recentMeetings.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-4"
        >
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Clock className="h-4 w-4 text-blue-500" />
            Recent Meetings
          </h4>

          <div className="grid gap-2">
            {recentMeetings.slice(0, 3).map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-700"
              >
                <div className="flex gap-3 items-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                    <Video className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{meeting.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{meeting.date}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => setMeetingCode(String(meeting.id))}
                >
                  Rejoin
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
