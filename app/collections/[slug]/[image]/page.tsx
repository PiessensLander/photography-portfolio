"use client"
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import ExifReader from 'exifreader';
import exifDataCard from "@/components/exifDataCard";
import { useEffect, useState } from "react";
import ExifDataCard from "@/components/exifDataCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Icon from "@/components/Icon";
import { downloadImageAction } from "@/app/actions";


export default function CollectionImagePage({ params }: { params: { image: string, slug: string } }) {
    const [exifData, setExifData] = useState<any>(null)

    const supabase = createClient();

    const { data } = supabase.storage.from('images').getPublicUrl(`${params.slug}/${params.image}`)

    useEffect(() => {
        if (data.publicUrl) {
            ExifReader.load(data.publicUrl).then(function (tags) {
                // The MakerNote tag can be really large. Remove it to lower
                // memory usage if you're parsing a lot of files and saving the
                // tags.
                delete tags['MakerNote'];

                setExifData(tags)

                // Use the tags now present in `tags`.
            }).catch(function (error) {
                // Handle error.
                console.log(error)
            });
        }
    }, [data.publicUrl])

    async function downloadImage(slug: string, image: string) {
        try {
            // Call the API route with slug and image parameters
            const response = await fetch(`/api/download?slug=${encodeURIComponent(slug)}&image=${encodeURIComponent(image)}`);

            //             if (!response.ok) throw new Error('Failed to download image');
            // 
            //             const blob = await response.blob();
            //             const url = window.URL.createObjectURL(blob);
            // 
            //             // Create a link element to trigger the download
            //             const a = document.createElement('a');
            //             a.href = url;
            //             a.download = image; // The filename to use when downloading the file
            //             document.body.appendChild(a);
            //             a.click();
            // 
            //             // Clean up
            //             a.remove();
            //             window.URL.revokeObjectURL(url);
            window.location.href = response.url;
        } catch (error) {
            console.error('Download error:', error);
        }
    }


    if (data.publicUrl && exifData) {
        return (
            <div>
                <Image src={data.publicUrl} alt={data.publicUrl} width={500} height={600} />
                {/* <ExifDataCard name="camera" value={exifData ? exifData.ApertureValue : 'N/A'} /> */}
                {/* <p>{JSON.stringify(exifData)}</p> */}
                <Button onClick={() => { downloadImage(params.slug, params.image) }}>
                    <Icon name="download" size="24" />
                </Button>

                <div className="flex justify-center gap-6">
                    <ExifDataCard name="camera" value={exifData.Make.description + " " + exifData.Model.description} />
                    <ExifDataCard name="aperture" value={exifData.FNumber.description} />
                </div>

            </div>
        );
    }

}
