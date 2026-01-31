import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
// Note: Vite loads .env automatically in the app, but for this standalone script we need dotenv
// Since we are running this with node, and the project might strict module, we'll try to use the hardcoded values just for the test to avoid setup issues if possible, or better yet, read the file.
// Actually, let's just use the values directly in the test script to be sure, since reading .env in node ESM project can be finicky without the right config.

const url = 'https://kqpgsrojcbjqszsshzzr.supabase.co';
const key = 'sb_publishable_jVsl-WNHaxrUEs_B_LZXyg_YXz8LgjM';

const supabase = createClient(url, key);

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('contacts').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed:', error.message);
            console.log('Hint: The key provided might be incorrect. It usually starts with "eyJ...".');
        } else {
            console.log('Connection successful!');
        }
    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

testConnection();
