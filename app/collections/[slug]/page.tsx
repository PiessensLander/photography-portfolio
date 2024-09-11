import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
export default async function CollectionPage({ params }: { params: { slug: string } }) {

    const supabase = createClient();

    const { data: collection, error } = await supabase.from('collections').select('*').eq('slug', params.slug).single();
    
    if (collection) {
        const { data: images, error: imagesError } = await supabase.from('images').select('*').eq('collection_id', collection.id);

        if (images) {
            console.log(images)
            return (
                <div>
                    <h1>Collection {collection.name}</h1>
                    <div>
                        {images.map((image) => (
                            <Link href={`/collections/${collection.slug}/${image.name}`}>
                                <Image src={image.original_url} alt={image.original_url} width={200} height={200} />
                            </Link>
                        ))}
                    </div>
                </div>
            );
        }
    }


    return (
        <div>
            <h1>Collection {params.slug}</h1>
        </div>
    );
}
