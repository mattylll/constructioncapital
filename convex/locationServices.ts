import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    county_slug: v.string(),
    town_slug: v.string(),
    town: v.string(),
    county: v.string(),
    service_slug: v.string(),
    service_name: v.string(),
    market_commentary: v.string(),
    faqs: v.array(
      v.object({
        question: v.string(),
        answer: v.string(),
      })
    ),
    deal_example: v.object({
      title: v.string(),
      description: v.string(),
      gdv: v.string(),
      loan_amount: v.string(),
      ltv: v.string(),
      loan_type: v.string(),
    }),
    rates: v.object({
      rate_from: v.string(),
      rate_to: v.string(),
      ltv_max: v.string(),
      term: v.string(),
      arrangement_fee: v.string(),
    }),
    meta_title: v.string(),
    meta_description: v.string(),
    is_published: v.boolean(),
    content_generated_at: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("location_services", args);
  },
});

export const getBySlug = query({
  args: {
    county_slug: v.string(),
    town_slug: v.string(),
    service_slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("location_services")
      .withIndex("by_location_service", (q) =>
        q
          .eq("county_slug", args.county_slug)
          .eq("town_slug", args.town_slug)
          .eq("service_slug", args.service_slug)
      )
      .first();
  },
});

export const getByLocation = query({
  args: { county_slug: v.string(), town_slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("location_services")
      .withIndex("by_location", (q) =>
        q.eq("county_slug", args.county_slug).eq("town_slug", args.town_slug)
      )
      .filter((q) => q.eq(q.field("is_published"), true))
      .collect();
  },
});

export const getAllPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("location_services")
      .withIndex("by_published", (q) => q.eq("is_published", true))
      .collect();
  },
});
