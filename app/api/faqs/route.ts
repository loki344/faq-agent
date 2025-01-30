import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = 'asst_m5fJSqtQrC8YX9DpgPpDVomB';

async function waitForRunCompletion(threadId: string, runId: string) {
    console.log(`[waitForRunCompletion] Starting to wait for run ${runId} in thread ${threadId}`);
    let run;
    let attempts = 0;
    do {
        attempts++;
        run = await openai.beta.threads.runs.retrieve(threadId, runId);
        console.log(`[waitForRunCompletion] Attempt ${attempts}: Run status: ${run.status}`);
        
        if (run.status === 'failed') {
            console.error(`[waitForRunCompletion] Run failed:`, run.last_error);
            throw new Error(`Run failed: ${run.last_error?.message || 'Unknown error'}`);
        }
        if (run.status !== 'completed') {
            console.log(`[waitForRunCompletion] Waiting 1 second before next check...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } while (run.status !== 'completed');
    
    console.log(`[waitForRunCompletion] Run completed successfully after ${attempts} attempts`);
    return run;
}

export async function POST() {
    console.log('[POST] Starting FAQ processing');
    try {
        const filePath = path.join(process.cwd(), 'app/api/CATAN_Spielanleitung_Basisspiel_1.pdf');
        console.log(`[POST] Reading file from: ${filePath}`);
        
        // Verify file exists and log its size
        const stats = fs.statSync(filePath);
        console.log(`[POST] File size: ${stats.size} bytes`);
        
        console.log('[POST] Creating file in OpenAI');
        // Upload the file to OpenAI
        const file = await openai.files.create({
            file: fs.createReadStream(filePath),
            purpose: 'assistants',
        });
        console.log(`[POST] File created in OpenAI with ID: ${file.id}`);

        console.log('[POST] Creating new thread');
        // Create a new thread
        const thread = await openai.beta.threads.create();
        console.log(`[POST] Thread created with ID: ${thread.id}`);

        console.log('[POST] Creating message in thread');
        // Add a message to the thread
        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: "Please analyze this document and create a comprehensive list of FAQs based on its content. Format the response as a JSON array of question-answer pairs.",
            attachments: [{
                file_id: file.id,
                tools: [{ type: "file_search" }]
            }]
        });
        console.log(`[POST] Message created with ID: ${message.id}`);

        console.log('[POST] Starting assistant run');
        // Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: ASSISTANT_ID,
        });
        console.log(`[POST] Run created with ID: ${run.id}`);

        console.log('[POST] Waiting for run completion');
        // Wait for the run to complete
        await waitForRunCompletion(thread.id, run.id);
        console.log('[POST] Run completed, fetching messages');

        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(thread.id);
        console.log(`[POST] Retrieved ${messages.data.length} messages`);
        
        const assistantResponse = messages.data.find(msg => msg.role === 'assistant');
        if (assistantResponse) {
            console.log('[POST] Found assistant response');
            console.log('[POST] Response content:', JSON.stringify(assistantResponse.content, null, 2));
        } else {
            console.warn('[POST] No assistant response found in messages');
        }
        
        const response = { 
            success: true, 
            thread_id: thread.id,
            run_id: run.id,
            message_id: message.id,
            file_id: file.id,
            assistant_response: assistantResponse?.content || []
        };
        console.log('[POST] Sending successful response:', JSON.stringify(response, null, 2));
        
        return NextResponse.json(response);
    } catch (error: any) {
        console.error('[POST] Error occurred:', error);
        console.error('[POST] Error stack:', error.stack);
        console.error('[POST] Error details:', JSON.stringify(error, null, 2));
        
        const errorResponse = { 
            success: false, 
            error: error.message || 'Failed to process FAQs',
            error_details: JSON.stringify(error, null, 2)
        };
        console.log('[POST] Sending error response:', JSON.stringify(errorResponse, null, 2));
        
        return NextResponse.json(
            errorResponse,
            { status: 500 }
        );
    }
}
