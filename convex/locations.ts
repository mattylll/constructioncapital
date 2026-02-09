import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBySlug = query({
  args: { county_slug: v.string(), town_slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("locations")
      .withIndex("by_town_slug", (q) =>
        q.eq("county_slug", args.county_slug).eq("town_slug", args.town_slug)
      )
      .first();
  },
});

export const getByCounty = query({
  args: { county_slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("locations")
      .withIndex("by_county_slug", (q) =>
        q.eq("county_slug", args.county_slug)
      )
      .filter((q) => q.eq(q.field("is_published"), true))
      .collect();
  },
});

export const getTopLocations = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("locations")
      .withIndex("by_priority")
      .order("desc")
      .take(args.limit ?? 200);
  },
});

export const getAllPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("locations")
      .withIndex("by_published", (q) => q.eq("is_published", true))
      .collect();
  },
});

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("locations")
      .withIndex("by_published", (q) => q.eq("is_published", true))
      .collect();
    const term = args.searchTerm.toLowerCase();
    return all
      .filter((loc) => loc.town.toLowerCase().includes(term))
      .slice(0, 10)
      .map((loc) => ({
        _id: loc._id,
        town: loc.town,
        county: loc.county,
        town_slug: loc.town_slug,
        county_slug: loc.county_slug,
      }));
  },
});

export const create = mutation({
  args: {
    county: v.string(),
    county_slug: v.string(),
    town: v.string(),
    town_slug: v.string(),
    region: v.string(),
    population: v.optional(v.number()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    local_planning_link: v.optional(v.string()),
    is_published: v.boolean(),
    priority: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("locations", args);
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("locations").collect();
  },
});

export const getRelatedTowns = query({
  args: {
    county_slug: v.string(),
    exclude_town_slug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const towns = await ctx.db
      .query("locations")
      .withIndex("by_county_slug", (q) =>
        q.eq("county_slug", args.county_slug)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("is_published"), true),
          q.neq(q.field("town_slug"), args.exclude_town_slug)
        )
      )
      .collect();
    return towns.slice(0, args.limit ?? 6);
  },
});
