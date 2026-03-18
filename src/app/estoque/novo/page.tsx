import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/r2";
import ProductForm from "@/components/ProductForm";

async function saveProduct(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const imageFile = formData.get("image") as File;

  let imageUrl = formData.get("currentImageUrl") as string | null;

  // Se um novo arquivo foi enviado, faz o upload
  if (imageFile && imageFile.size > 0) {
    const uploadedUrl = await uploadImage(imageFile);
    if (uploadedUrl) {
      imageUrl = uploadedUrl;
    }
  }

  const data = { 
    name, 
    description, 
    category, 
    price, 
    stock,
    image: imageUrl
  };

  if (id) {
    await prisma.product.update({
      where: { id },
      data,
    });
  } else {
    await prisma.product.create({
      data,
    });
  }

  revalidatePath("/estoque");
  revalidatePath("/");
  redirect("/estoque");
}

export default async function ProductFormPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const id = (await params).id;
  const product = id ? await prisma.product.findUnique({ where: { id } }) : null;

  return (
    <ProductForm product={product} saveAction={saveProduct} />
  );
}
