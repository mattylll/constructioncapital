import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  locations: defineTable({
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
  })
    .index("by_county_slug", ["county_slug"])
    .index("by_town_slug", ["county_slug", "town_slug"])
    .index("by_region", ["region"])
    .index("by_priority", ["priority"])
    .index("by_published", ["is_published"]),

  location_services: defineTable({
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
  })
    .index("by_location_service", [
      "county_slug",
      "town_slug",
      "service_slug",
    ])
    .index("by_location", ["county_slug", "town_slug"])
    .index("by_service", ["service_slug"])
    .index("by_published", ["is_published"]),

  counties: defineTable({
    name: v.string(),
    slug: v.string(),
    region: v.string(),
    description: v.string(),
    meta_title: v.string(),
    meta_description: v.string(),
    town_count: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_region", ["region"]),

  leads: defineTable({
    project_location: v.string(),
    project_postcode: v.optional(v.string()),
    gdv: v.number(),
    total_cost: v.number(),
    loan_amount: v.number(),
    loan_type: v.string(),
    project_type: v.optional(v.string()),
    units: v.optional(v.number()),
    additional_info: v.optional(v.string()),
    full_name: v.string(),
    email: v.string(),
    phone: v.string(),
    company: v.optional(v.string()),
    source_page: v.string(),
    utm_source: v.optional(v.string()),
    utm_medium: v.optional(v.string()),
    utm_campaign: v.optional(v.string()),
    submitted_at: v.number(),
    status: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_submitted_at", ["submitted_at"]),

  case_studies: defineTable({
    title: v.string(),
    slug: v.string(),
    location: v.string(),
    county: v.optional(v.string()),
    project_type: v.string(),
    gdv: v.string(),
    loan_amount: v.string(),
    loan_type: v.string(),
    ltv: v.string(),
    description: v.string(),
    challenge: v.string(),
    solution: v.string(),
    outcome: v.string(),
    image_url: v.optional(v.string()),
    is_featured: v.boolean(),
    published_at: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_featured", ["is_featured"])
    .index("by_location", ["county"]),
});
