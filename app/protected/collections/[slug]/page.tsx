import { createClient } from "@/utils/supabase/server";
import { uploadImageAction } from "@/app/actions";
import { redirect } from "next/navigation";
import UploadForm from "@/components/uploadForm";
import { FormMessage, Message } from "@/components/form-message";

export default async function CollectionPage({ params, searchParams }: { params: { slug: string }, searchParams: Message }) {
    return (
        <div>
            <UploadForm slug={params.slug} />
            <FormMessage message={searchParams} />
        </div>
    );
}
