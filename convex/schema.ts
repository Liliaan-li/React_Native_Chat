import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Other tables here...

    groups: defineTable({
        description: v.string(),
        icon_url: v.string(),
        name: v.string(),
    }),
});