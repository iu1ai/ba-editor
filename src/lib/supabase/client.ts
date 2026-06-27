import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createBrowserClient(
	PUBLIC_SUPABASE_URL || '',
	PUBLIC_SUPABASE_ANON_KEY || '',
	{
		auth: {
			persistSession: true, // Store session in LocalStorage/Cookies
			autoRefreshToken: true, // Libary will refresh JWT via Refresh Token
			detectSessionInUrl: true
		}
	}
);