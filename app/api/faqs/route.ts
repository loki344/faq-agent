import { NextResponse } from 'next/server';
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

export async function POST(request: Request) {
    console.log('[POST] Starting FAQ processing');
    try {
        const body = await request.json();
        const { fileIds } = body;
        
        if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No fileIds provided or invalid format' },
                { status: 400 }
            );
        }

        // Create a new thread
        console.log('[POST] Creating new thread');
        const thread = await openai.beta.threads.create();
        console.log(`[POST] Thread created with ID: ${thread.id}`);

        console.log('[POST] Creating messages in thread');
        // Add messages for each file to the thread

        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: "Please analyze this document and create a comprehensive list of FAQs based on its content. Format the response as a JSON array of question-answer pairs.",
            attachments: fileIds.map(fileId => ({
                file_id: fileId,
                tools: [{ type: "file_search" }]
            }))
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
            
            // Extract the JSON array from the response
            const content = assistantResponse.content[0] as { type: string, text: { value: string } };
            console.log(content.text.value, 'to be parsed');
            
            // More robust parsing of the markdown-wrapped JSON
            const jsonString = content.text.value
                .trim()
                .replace(/^```json\s*/, '')  // Remove opening fence with any whitespace
                .replace(/\s*```$/, '')      // Remove closing fence with any whitespace
                .trim();                     // Remove any remaining whitespace
            
            console.log(jsonString, 'after cleaning');  // Debug log
            
            const faqArray = JSON.parse(jsonString);
            console.log('[POST] Sending successful response:', JSON.stringify(faqArray, null, 2));
            
            return NextResponse.json(faqArray);
        } else {
            console.warn('[POST] No assistant response found in messages');
            return NextResponse.json(
                { success: false, error: 'No response from assistant' },
                { status: 500 }
            );
        }
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
