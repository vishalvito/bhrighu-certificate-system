const SUPABASE_URL =
    "https://nixqpteixqvpvycqhnar.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_lNW5uUSEbMfyPzwZNUoNwQ_5rmbNvCW";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );