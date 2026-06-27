import { writable } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { browser } from '$app/environment';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        user: null,
        session: null,
        loading: true
    });

    if (browser) {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            set({
                user: session?.user ?? null,
                session,
                loading: false
            });
        });

        // Listen for auth state changes
        supabase.auth.onAuthStateChange((_event, session) => {
            set({
                user: session?.user ?? null,
                session,
                loading: false
            });
        });
    }

    return {
        subscribe,
        signOut: async () => {
            await supabase.auth.signOut();
        }
    };
}

export const auth = createAuthStore();