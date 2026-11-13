import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/db";
import { getCategories } from "@/lib/queries";
import { PostForm } from "./post-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage(props: PageProps<"/admin/posts/[id]">) {
  const { id } = await props.params;
  const { saved } = await props.searchParams;
  const categories = await getCategories();

  if (id === "new") {
    return <PostForm post={null} categories={categories} />;
  }
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();
  const post = await db.query.posts.findFirst({
    where: eq(schema.posts.id, postId),
    with: { products: { orderBy: [asc(schema.products.position)] } },
  });
  if (!post) notFound();
  return <PostForm post={post} categories={categories} justCreated={saved === "1"} />;
}
