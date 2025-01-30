import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Get a specific FAQ collection by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { data, error } = await supabase
            .from('faq_collection')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return NextResponse.json(
                { error: 'FAQ collection not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch FAQ collection' },
            { status: 500 }
        );
    }
} 