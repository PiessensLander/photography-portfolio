import { createClient } from "@/utils/supabase/server";
import { uploadImageAction } from "../actions";
import { redirect } from "next/navigation";
import UploadForm from "@/components/uploadForm";
import { FormMessage, Message } from "@/components/form-message";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  const { data, error } = await supabase.from('collections').select('*');

  if (data) {
    return (
      <>
        <main className="flex-1 flex flex-col gap-6 px-4">
          {data.map((collection) => (
            <Link key={collection.id} href={`/protected/collections/${collection.slug}`}>
              <h2 className="text-2xl font-bold">{collection.name}</h2>
            </Link>
          ))}
        </main>
      </>
    );
  }

  return null;
}
