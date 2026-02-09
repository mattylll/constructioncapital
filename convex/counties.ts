import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    region: v.string(),
    description: v.string(),
    meta_title: v.string(),
    meta_description: v.string(),
    town_count: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("counties", args);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("counties")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("counties").collect();
  },
});

export const getByRegion = query({
  args: { region: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("counties")
      .withIndex("by_region", (q) => q.eq("region", args.region))
      .collect();
  },
});
