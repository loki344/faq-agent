import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    console.log('[POST] Starting file upload');
    try {
        const formData = await request.formData();
        const fileData = formData.get('file');
        
        if (!fileData || !(fileData instanceof File)) {
            return NextResponse.json(
                { success: false, error: 'No valid file provided' },
                { status: 400 }
            );
        }

        console.log(`[POST] Received file: ${fileData.name}, size: ${fileData.size} bytes`);
        
        console.log('[POST] Creating file in OpenAI');
        const openaiFile = await openai.files.create({
            file: fileData,
            purpose: 'assistants',
        });
        console.log(`[POST] File created in OpenAI with ID: ${openaiFile.id}`);

        return NextResponse.json({
            success: true,
            fileId: openaiFile.id
        });
        
    } catch (error: any) {
        console.error('[POST] Error occurred:', error);
        console.error('[POST] Error stack:', error.stack);
        
        const errorResponse = { 
            success: false, 
            error: error.message || 'Failed to upload file',
            error_details: JSON.stringify(error, null, 2)
        };
        console.log('[POST] Sending error response:', JSON.stringify(errorResponse, null, 2));
        
        return NextResponse.json(
            errorResponse,
            { status: 500 }
        );
    }
}

export async function GET() {
    console.log('[GET] Fetching OpenAI files');
    try {
        const filesList = await openai.files.list();
        
        console.log(`[GET] Retrieved ${filesList.data.length} files`);
        
        return NextResponse.json({
            success: true,
            files: filesList.data
        });
        
    } catch (error: any) {
        console.error('[GET] Error occurred:', error);
        console.error('[GET] Error stack:', error.stack);
        
        const errorResponse = { 
            success: false, 
            error: error.message || 'Failed to fetch files',
            error_details: JSON.stringify(error, null, 2)
        };
        console.log('[GET] Sending error response:', JSON.stringify(errorResponse, null, 2));
        
        return NextResponse.json(
            errorResponse,
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    console.log('[DELETE] Starting file deletion');
    try {
        const { fileId } = await request.json();
        
        if (!fileId) {
            return NextResponse.json(
                { success: false, error: 'No fileId provided' },
                { status: 400 }
            );
        }

        console.log(`[DELETE] Deleting file with ID: ${fileId}`);
        await openai.files.del(fileId);
        
        console.log(`[DELETE] Successfully deleted file: ${fileId}`);
        return NextResponse.json({
            success: true,
            message: `File ${fileId} deleted successfully`
        });
        
    } catch (error: any) {
        console.error('[DELETE] Error occurred:', error);
        console.error('[DELETE] Error stack:', error.stack);
        
        const errorResponse = { 
            success: false, 
            error: error.message || 'Failed to delete file',
            error_details: JSON.stringify(error, null, 2)
        };
        console.log('[DELETE] Sending error response:', JSON.stringify(errorResponse, null, 2));
        
        return NextResponse.json(
            errorResponse,
            { status: 500 }
        );
    }
} 