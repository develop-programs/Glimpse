import { atom } from 'jotai';

// State atoms for room controls
export const micAtom = atom(true);
export const cameraAtom = atom(true);
export const screenShareAtom = atom(false);
export const chatAtom = atom(false);
export const recordingAtom = atom(false);
export const participantsAtom = atom(false);

// Room data atoms
export const roomConnectionStatusAtom = atom<'connecting' | 'connected' | 'disconnected'>('disconnected');
export const roomErrorAtom = atom<string | null>(null);
export const roomParticipantsAtom = atom<string[]>([]);

// Chat message type
export type ChatMessage = {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
};

// Chat messages atom
export const chatMessagesAtom = atom<ChatMessage[]>([]);
