import sessionWithPersist from '@/data/session';
import { useAtom } from 'jotai';
import React from 'react'

export const useSession = () => {
    const [session, setSession] = useAtom(sessionWithPersist);

    const clearSession = () => {
        sessionStorage.removeItem('userSession');
        setSession({ isAuthenticated: false });
    };

    return {
        session,
        setSession,
        clearSession,
        isAuthenticated: session.isAuthenticated
    };
};