/* ==========================================
   BHRIGHU ADVENTURE
   SUPABASE CONNECTION
========================================== */

const SUPABASE_URL =
    "https://zcthkoptgouaarpmtzda.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_A7rbNpBtWGX8IUiGDJ7cIg_8DnCO0fP";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );