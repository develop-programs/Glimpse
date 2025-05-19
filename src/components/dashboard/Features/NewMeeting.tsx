import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Info, Users, VideoIcon, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { useAtom } from 'jotai';
import { recentMeetingsAtom } from '@/data/recentData';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '@/services/api';

// Generate a random room ID for guest users
// Exported for use in tests
export const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 12);
};

export default function NewMeeting() {
    const [recentMeetings] = useAtom(recentMeetingsAtom);
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAndJoinMeeting = async () => {
        try {
            setIsCreating(true);
            setError(null);
            
            // Check if user is authenticated
            const token = localStorage.getItem('auth_token');
            let roomId;
            
            // Function to check if token is valid (basic check)
            const isTokenValid = (token: string | null): boolean => {
                if (!token) return false;
                // Check if token has basic JWT structure
                const parts = token.split('.');
                return parts.length === 3;
            };
            
            if (!token || !isTokenValid(token)) {
                // For guest users, create a random room ID
                roomId = generateRoomId();
                console.log('Created guest room with ID:', roomId);
                
                // Generate a temporary user ID for anonymous usage
                const tempUserId = 'guest-' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('userId', tempUserId);
                
                // Navigate to the room with the generated ID
                navigate(`/room/${roomId}`);
                return;
            }
            
            // For authenticated users, use the API
            // Generate a meeting name
            const meetingName = `Meeting ${new Date().toLocaleString()}`;
            
            console.log('Creating room with name:', meetingName);
            
            try {
                // Create room via API
                const response = await api.post('/api/rooms', {
                    name: meetingName,
                    description: `Instant meeting created on ${new Date().toLocaleString()}`
                });
                
                console.log('Room creation response:', response);
                
                if (response.data && response.data.data) {
                    roomId = response.data.data._id;
                    console.log('Created room with ID:', roomId);
                    // Navigate to the room
                    navigate(`/room/${roomId}`);
                } else {
                    throw new Error('Failed to create room: Invalid server response');
                }
            } catch (apiError) {
                console.error('API error creating room:', apiError);
                // If API call fails (401 unauthorized or other error), fall back to guest mode
                console.log('Falling back to guest mode due to API error');
                roomId = generateRoomId();
                console.log('Created guest room with ID:', roomId);
                navigate(`/room/${roomId}`);
            }
        } catch (err) {
            console.error('Error creating meeting:', err);
            setError(err instanceof Error ? err.message : 'Failed to create meeting');
        } finally {
            setIsCreating(false);
        }
    };

    const joinExistingMeeting = (meetingId: string) => {
        navigate(`/room/${meetingId}`);
    };

    return (
        <div className="space-y-8">
            <DialogHeader className="text-center">
                <DialogTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                    <span className="relative">
                        Meetings
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500 rounded-full transform"></span>
                    </span>
                </DialogTitle>
            </DialogHeader>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="w-full grid grid-cols-1 gap-4">
                {/* Start Meeting Card */}
                <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 
                    shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="p-2 flex flex-col h-full">
                        <div className="mb-4">
                            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                                <VideoIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-medium">Start a Meeting</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Create a new instant meeting
                            </p>
                        </div>
                        <Button
                            className="mt-auto bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                            onClick={createAndJoinMeeting}
                            disabled={isCreating}
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    Start Now <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Recent Meetings Section */}
            {recentMeetings.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Recent Meetings
                    </h4>
                    <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-auto pr-1">
                        {recentMeetings.slice(0, 3).map(meeting => (
                            <div
                                key={meeting.id}
                                className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 
                                backdrop-blur-sm rounded-lg border border-slate-100 dark:border-slate-700 
                                hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{meeting.name}</p>
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <span className="text-xs">{meeting.date}</span>
                                            <span className="text-xs">•</span>
                                            <span className="text-xs flex items-center gap-1">
                                                <Users className="h-3 w-3" /> {meeting.participants}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className="text-xs bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 
                                    dark:text-blue-400 hover:text-blue-700 border border-blue-200 dark:border-blue-800 rounded-lg"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => joinExistingMeeting(String(meeting.id))}
                                >
                                    Resume
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <DialogFooter className="flex justify-between items-center pt-3 border-t">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs">
                    <Info className="h-3 w-3" />
                    End-to-end encrypted
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-500 dark:text-slate-400 hover:text-blue-600"
                    onClick={() => console.log("Opening settings")}
                >
                    Settings
                </Button>
            </DialogFooter>
        </div>
    );
}
