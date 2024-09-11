// Import Next.js Response type
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from "next/navigation";

// Define the GET handler for downloading the blob
export async function GET(request: Request) {
    const supabase = createClient();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const image = searchParams.get('image');

    if (!slug || !image) {
        return new NextResponse('Missing slug or image parameter', { status: 400 });
    }

    try {
        const { data, error } = await supabase.storage.from('images').download(`${slug}/${image}`)
        if (error) {
            throw error
        }
        // // Example blob data - this could be fetched from a database, cloud storage, etc.
        // const data = 'Hello, this is a sample text file!';
        // const blob = Buffer.from(data, 'utf-8');

        // Set headers to return the blob as a downloadable file
        const headers = new Headers({
            'Content-Type': data.type,
            'Content-Disposition': `attachment; filename="${image}"`,
        });

        // Return the blob as a response
        return new NextResponse(data, { headers });
    } catch (error) {
        // Handle any errors
        return new NextResponse('Error generating blob', { status: 500 });
    }
}
