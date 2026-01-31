import { supabase } from '../lib/supabase';

export const api = {
    // Products
    products: {
        async list() {
            const { data, error } = await supabase.from('products').select('*');
            if (error) throw error;
            return data;
        },
        async create(product) {
            const { data, error } = await supabase.from('products').insert(product).select().single();
            if (error) throw error;
            return data;
        },
        async update(id, updates) {
            const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        async delete(id) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
        }
    },

    // Contacts
    contacts: {
        async list() {
            const { data, error } = await supabase.from('contacts').select('*');
            if (error) throw error;
            return data;
        },
        async create(contact) {
            const { data, error } = await supabase.from('contacts').insert(contact).select().single();
            if (error) throw error;
            return data;
        },
        async update(id, updates) {
            const { data, error } = await supabase.from('contacts').update(updates).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        async delete(id) {
            const { error } = await supabase.from('contacts').delete().eq('id', id);
            if (error) throw error;
        }
    },

    // Invoices
    invoices: {
        async list() {
            const { data, error } = await supabase.from('invoices').select('*, items:invoice_items(*)');
            if (error) throw error;
            return data;
        },
        async create(invoice, items) {
            const { data: inv, error: invError } = await supabase.from('invoices').insert(invoice).select().single();
            if (invError) throw invError;
            if (items && items.length > 0) {
                const itemsWithId = items.map(item => ({ ...item, invoice_id: inv.id }));
                const { error: itemsError } = await supabase.from('invoice_items').insert(itemsWithId);
                if (itemsError) throw itemsError;
            }
            return inv;
        },
        async update(id, updates) {
            const { data, error } = await supabase.from('invoices').update(updates).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        async delete(id) {
            const { error } = await supabase.from('invoices').delete().eq('id', id);
            if (error) throw error;
        }
    },

    // Accounts
    accounts: {
        async list() {
            const { data, error } = await supabase.from('accounts').select('*');
            if (error) throw error;
            return data;
        },
        async create(account) {
            const { data, error } = await supabase.from('accounts').insert(account).select().single();
            if (error) throw error;
            return data;
        },
        async delete(id) {
            const { error } = await supabase.from('accounts').delete().eq('id', id);
            if (error) throw error;
        }
    },

    // Transactions
    transactions: {
        async list() {
            const { data, error } = await supabase.from('transactions').select('*');
            if (error) throw error;
            return data;
        },
        async create(transaction) {
            const { data, error } = await supabase.from('transactions').insert(transaction).select().single();
            if (error) throw error;
            return data;
        },
        async update(id, updates) {
            const { data, error } = await supabase.from('transactions').update(updates).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        async delete(id) {
            const { error } = await supabase.from('transactions').delete().eq('id', id);
            if (error) throw error;
        }
    }
};
