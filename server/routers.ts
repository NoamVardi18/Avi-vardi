import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createBooking, getAllBookings } from "./db";
import { saveLeadToSupabase } from "./supabase";

// Avi Vardi's WhatsApp number (without + prefix, international format)
const OWNER_WHATSAPP = "972524804842";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  bookings: router({
    /**
     * Public procedure: any visitor can submit a booking lead.
     * Saves to DB, notifies owner via Manus notification system,
     * and returns a WhatsApp link as an additional notification channel.
     */
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "שם חובה"),
          phone: z.string().min(9, "מספר טלפון חובה"),
          tripDate: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Save to Supabase avi-vardi-bus project (primary)
        try {
          await saveLeadToSupabase({
            name: input.name,
            phone: input.phone,
            date: input.tripDate ?? null,
            notes: input.notes ?? null,
          });
        } catch (err) {
          console.error("[Bookings] Failed to save to Supabase:", err);
          // Don't throw - still notify owner via WhatsApp
        }

        // Also save to local DB if available
        try {
          await createBooking({
            name: input.name,
            phone: input.phone,
            tripDate: input.tripDate ?? null,
            notes: input.notes ?? null,
          });
        } catch (err) {
          console.warn("[Bookings] Local DB save failed (non-critical):", err);
        }

        // Build notification content
        let notifContent = `שם: ${input.name}\nטלפון: ${input.phone}`;
        if (input.tripDate) notifContent += `\nתאריך: ${input.tripDate}`;
        if (input.notes) notifContent += `\nפרטים: ${input.notes}`;

        // Notify owner via Manus notification system (primary channel)
        await notifyOwner({
          title: `🚌 פנייה חדשה מהאתר - ${input.name}`,
          content: notifContent,
        }).catch((err) =>
          console.warn("[Bookings] Owner notification failed:", err)
        );

        // Build WhatsApp URL as secondary notification channel
        let msg = `🚌 *פנייה חדשה מהאתר - אבי ורדי הסעות*\n\n`;
        msg += `👤 *שם:* ${input.name}\n`;
        msg += `📞 *טלפון:* ${input.phone}\n`;
        if (input.tripDate) msg += `📅 *תאריך:* ${input.tripDate}\n`;
        if (input.notes) msg += `📝 *פרטים:* ${input.notes}\n`;
        msg += `\nנשלח מהאתר אוטומטית`;

        const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`;

        return { success: true, whatsappUrl };
      }),

    /**
     * List all bookings - for owner use only.
     */
    list: publicProcedure.query(async () => {
      return getAllBookings();
    }),
  }),
});

export type AppRouter = typeof appRouter;
