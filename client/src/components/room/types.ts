export type ViewType = 'gallery' | 'speaker' | 'presentation';

export interface Participant {
  id: number;
  name: string;
  isCurrentUser?: boolean;
}

export interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
}

// Animation transitions
export const defaultTransition = { duration: 0.2, ease: "easeOut" };
export const buttonTransition = { duration: 0.15, ease: "easeOut" };
export const springTransition = { type: "spring", stiffness: 400, damping: 25 };
