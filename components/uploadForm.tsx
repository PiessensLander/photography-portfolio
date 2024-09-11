"use client"

import { uploadImageAction } from "@/app/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Define a schema for a single image file
const imageFileSchema = z.instanceof(File)
    .refine(
        (file) => file.type.startsWith('image/'), {
        message: 'Only image files are allowed.',
    })
    ;

// Define a schema for an array of up to 5 image files
const imageArraySchema = z.array(imageFileSchema).min(1).max(5, {
    message: 'You can only upload up to 5 images.',
});

// Define the form schema
const formSchema = z.object({
    images: imageArraySchema,
}).required();

export default function UploadForm({ slug }: { slug?: string }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            images: [],
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values.images)
        const formData = new FormData();
        values.images.forEach((image) => {
            formData.append('images', image);
        });
        uploadImageAction(formData, slug)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{field.name}</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    onChange={(e) => {
                                        const files = e.target.files ? Array.from(e.target.files) : [];
                                        field.onChange(files);
                                    }}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                    multiple
                                />
                            </FormControl>
                            <FormDescription>
                                Max 5 images.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )

}