import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Index() {
  const supabase = createClient();

  const { data, error } = await supabase.from('collections').select('*');

  if (data) {
    return (
      <>
        <main className="flex-1 flex flex-col gap-6 px-4">
          {data.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.slug}`}>
              <h2 className="text-2xl font-bold">{collection.name}</h2>
            </Link>
          ))}
        </main>
      </>
    );
  }

  return <div>Error: {error.message}</div>;
}
