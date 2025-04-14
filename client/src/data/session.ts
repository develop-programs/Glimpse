import { atom, useAtom } from "jotai";

// Define session interface
interface SessionData {
  userId?: string;
  username?: string;
  token?: string;
  isAuthenticated: boolean;
  [key: string]: any; // Allow for additional properties
}

// Initialize session from sessionStorage or set defaults
const initializeSession = (): SessionData => {
  const storedSession = sessionStorage.getItem('userSession');
  return storedSession ? JSON.parse(storedSession) : { isAuthenticated: false };
};

// Create session atom with the correct type
const sessionAtom = atom<SessionData>(initializeSession());

// Subscribe to changes and update sessionStorage
const sessionWithPersist = atom(
  (get) => get(sessionAtom),
  (get, set, update: Partial<SessionData>) => {
    const newSession = { ...get(sessionAtom), ...update };
    set(sessionAtom, newSession);
    sessionStorage.setItem('userSession', JSON.stringify(newSession));
  }
);

// Helper hook to use session


export default sessionWithPersist;
