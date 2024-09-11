"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};


export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const uploadImageAction = async (formData: FormData, slug?: string) => {
  const supabase = createClient();
  const images = formData.getAll("images") as File[];

  try {
    for (const image of images) {
      // Upload image to storage bucket
      const { error } = await supabase.storage.from("images").upload(`${slug ?? 'original'}/${image.name}`, image);

      if (error) {
        throw error.message;
      }

      // Get the public URL of the uploaded image to insert into the database
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(`original/${image.name}`);

      // Get the collection data to associate the image with
      const { data: collectionsData } = await supabase.from('collections').select('*').eq('slug', slug).single();

      // Insert the image into the database to associate it with a collection
      const { error: insertError } = await supabase.from("images").insert({
        collection_id: collectionsData.id,
        original_url: publicUrlData.publicUrl,
        name: image.name,
      });

      if (insertError) {
        throw insertError.message;
      }

    }
  } catch (error) {
    return encodedRedirect("error", "/protected", error as string);
  }

  return encodedRedirect("success", "/protected", "All files uploaded successfully");
}

export const downloadImageAction = async (slug: string, image: string) => {
  const supabase = createClient();
  const { data } = await supabase.storage.from('images').download(`${slug}/${image}`);

  return data;
}