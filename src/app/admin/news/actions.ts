"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteArticle,
  setPublished,
  updateArticle,
  type NewsCategory,
  type NewsTier,
} from "@/lib/news-db";

/**
 * Toggle an article's published state. Used by the list view's quick actions.
 */
export async function togglePublishAction(
  id: number,
  nextState: boolean
): Promise<void> {
  setPublished(id, nextState);
  revalidatePath("/news");
  revalidatePath(`/admin/news`);
  revalidatePath(`/admin/news/${id}`);
}

/**
 * Save edits from the article form. Re-validates the public page so ISR
 * picks up the changes on the next hit.
 */
export async function saveArticleAction(
  id: number,
  formData: FormData
): Promise<void> {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const category = String(formData.get("category") ?? "") as NewsCategory;
  const tier = String(formData.get("tier") ?? "daily-brief") as NewsTier;
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const isPublished = formData.get("is_published") === "on";

  updateArticle(id, {
    title,
    excerpt,
    body,
    category,
    tier,
    tags,
    is_published: isPublished,
  });

  revalidatePath("/news");
  revalidatePath(`/admin/news`);
  revalidatePath(`/admin/news/${id}`);
}

/**
 * Permanently delete an article. No soft-delete in v1 — if that proves
 * uncomfortable, we'll add an archived flag later.
 */
export async function deleteArticleAction(id: number): Promise<void> {
  deleteArticle(id);
  revalidatePath("/news");
  revalidatePath("/admin/news");
  redirect("/admin/news");
}
