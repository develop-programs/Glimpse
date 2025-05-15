import {Button} from "@/components/ui/button.tsx";
import {CallEnd, CameraOn, Chat, MicOn, Participants, ScreenShare, Copy, Record, Info} from "@/components/icons";
import {useAtom} from "jotai";
import {micAtom, cameraAtom, screenShareAtom, recordingAtom, chatAtom, participantsAtom} from "@/data/room";
import {useState} from "react";

type ControlProps = {
    meetingId: string | undefined;
    ToggleMic: () => void;
    ToggleCamera: () => void;
    ToggleScreenShare: () => void;
    ToggleChat: () => void;
    ToggleRecording: () => void;
    ToggleParticipants: () => void;
    Leave: () => void;
}

export default function Controls(props: ControlProps) {
    const [mic] = useAtom(micAtom);
    const [camera] = useAtom(cameraAtom);
    const [screenShare] = useAtom(screenShareAtom);
    const [recording] = useAtom(recordingAtom);
    const [chat] = useAtom(chatAtom);
    const [participants] = useAtom(participantsAtom);
    const [copied, setCopied] = useState(false);

    const copyMeetingId = () => {
        if (props.meetingId) {
            navigator.clipboard.writeText(props.meetingId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div
            className="fixed bottom-0 left-0 right-0 flex flex-col md:flex-row justify-between w-full p-3 bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200">
            {/* Meeting ID - Top on mobile, left on desktop */}
            <div
                className="flex items-center justify-center md:justify-start mb-3 md:mb-0 md:order-1 cursor-pointer mx-auto md:mx-0"
                onClick={copyMeetingId}
            >
                <div
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 hover:bg-gray-100 transition-all">
                    <Copy/>
                    <span className="font-medium text-sm max-w-[150px] truncate">{props.meetingId}</span>
                    <span className={`text-xs ${copied ? 'text-green-600' : 'text-transparent'} transition-colors`}>
                        {copied ? 'Copied!' : 'Copy'}
                    </span>
                </div>
            </div>

            {/* Main controls - bottom row on mobile, center on desktop */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 md:order-2">
                <Button
                    onClick={props.ToggleMic}
                    className={`size-10 md:size-11 rounded-full shadow-md flex items-center justify-center p-0
                        ${mic ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white hover:bg-gray-100'}`}
                    aria-label={mic ? "Mute microphone" : "Unmute microphone"}
                >
                    <MicOn/>
                </Button>

                <Button
                    onClick={props.ToggleCamera}
                    className={`size-10 md:size-11 rounded-full shadow-md flex items-center justify-center p-0
                        ${camera ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white hover:bg-gray-100'}`}
                    aria-label={camera ? "Turn off camera" : "Turn on camera"}
                >
                    <CameraOn/>
                </Button>

                <Button
                    onClick={props.ToggleScreenShare}
                    className={`size-10 md:size-11 rounded-full shadow-md flex items-center justify-center p-0
                        ${screenShare ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white hover:bg-gray-100'}`}
                    aria-label={screenShare ? "Stop sharing" : "Share screen"}
                >
                    <ScreenShare/>
                </Button>

                <Button
                    onClick={props.ToggleRecording}
                    className={`size-10 md:size-11 rounded-full shadow-md flex items-center justify-center p-0
                        ${recording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white hover:bg-gray-100'}`}
                    aria-label={recording ? "Stop recording" : "Start recording"}
                >
                    <Record/>
                </Button>

                <Button
                    onClick={props.ToggleChat}
                    className={`size-10 md:size-11 rounded-full shadow-md flex items-center justify-center p-0
                        ${chat ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white hover:bg-gray-100'}`}
                    aria-label={chat ? "Close chat" : "Open chat"}
                >
                    <Chat/>
                </Button>

                <Button
                    onClick={props.ToggleParticipants}
                    className={`size-10 md:size-11 rounded-full shadow-md flex items-center justify-center p-0
                        ${participants ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white hover:bg-gray-100'}`}
                    aria-label={participants ? "Hide participants" : "Show participants"}
                >
                    <Participants/>
                </Button>

                <Button
                    className={`size-10 md:size-11 rounded-full shadow-md flex items-center justify-center p-0 bg-white hover:bg-gray-100 transition-all`}
                    aria-label={mic ? "Mute microphone" : "Unmute microphone"}
                >
                    <Info/>
                </Button>

                <Button
                    onClick={props.Leave}
                    className="bg-red-500 text-white hover:bg-red-600 rounded-full shadow-md flex items-center justify-center h-10 px-3 md:px-4 md:h-11"
                    aria-label="End call"
                >
                    <CallEnd/>
                    <span className="text-sm md:text-base font-medium">End</span>
                </Button>
            </div>


        </div>
    );
}
