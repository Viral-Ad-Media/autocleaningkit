import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const posts = await db.query.posts.findMany({
    orderBy: [desc(schema.posts.publishedAt)],
    with: { category: true, products: { columns: { id: true, url: true }, orderBy: [asc(schema.products.position)] } },
  });
  const needsText = posts.filter((p) => !p.body.trim()).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="mt-1 text-sm text-ink/60">
            {posts.length} posts. {needsText} still need their article text, which wasn&apos;t in the backup.
          </p>
        </div>
        <Link href="/admin/posts/new" className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600">
          New post
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-black/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-black/[0.03] text-xs uppercase tracking-wider text-ink/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {posts.map((p) => {
              const linked = p.products.filter((x) => x.url).length;
              return (
                <tr key={p.id} className="hover:bg-brand-50/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/${p.id}`} className="font-semibold hover:text-brand-600">{p.title}</Link>
                    <div className="text-xs text-ink/50">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">{p.category.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? "bg-green-100 text-green-800" : "bg-black/5 text-ink/60"}`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                      {!p.body.trim() && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Needs text</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {p.products.length}
                    {p.products.length > 0 && <span className="text-xs text-ink/50"> ({linked} linked)</span>}
                  </td>
                  <td className="px-4 py-3 text-ink/70">{formatDate(p.publishedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
