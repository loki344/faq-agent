import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Get all FAQ collections
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('faq_collection')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch FAQ collections' },
            { status: 500 }
        );
    }
}

// Create a new FAQ collection
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.name) {
            return NextResponse.json(
                { error: 'Collection name is required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('faq_collection')
            .insert([
                {
                    name: body.name,
                }
            ])
            .select()
            .single();

        console.log(data); 
        console.log(error);
        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to create FAQ collection' },
            { status: 500 }
        );
    }
} 