import { createClient } from '@supabase/supabase-js';

const url = 'https://kqpgsrojcbjqszsshzzr.supabase.co';
const key = 'sb_publishable_jVsl-WNHaxrUEs_B_LZXyg_YXz8LgjM';

const supabase = createClient(url, key);

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        // Try to fetch something simple. Even if table doesn't exist, we might get a different error than 401.
        // But we expect contacts to exist if they ran the SQL.
        const { data, error } = await supabase.from('contacts').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Supabase Error:', error);
            if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
                console.log('AUTH_ERROR');
            }
        } else {
            console.log('SUCCESS');
        }
    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

testConnection();
