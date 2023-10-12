import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        //will collect all elements and return them
        return await ctx.db.query('groups').collect();
    }
})
export const getOneGroup = query({
    args: {id: v.id('groups')},
    handler: async (ctx, {id}) => {
        //will one unique element
        return await ctx.db.query('groups').filter((q) => q.eq(q.field('_id'), id))
            .unique();
    }
})
export const create = mutation({
    args: {description: v.string(), name: v.string(), icon_url: v.string()},
    handler: async ({db}, args) => {
        return await db.insert('groups', args)
    }
})