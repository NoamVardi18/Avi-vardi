import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { saveLeadToSupabase } from "./supabase";

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
        await saveLeadToSupabase({
          name: input.name,
          phone: input.phone,
          date: input.tripDate ?? null,
          notes: input.notes ?? null,
        });

        let msg = `🚌 *פנייה חדשה מהאתר - אבי ורדי הסעות*\n\n`;
        msg += `👤 *שם:* ${input.name}\n`;
        msg += `📞 *טלפון:* ${input.phone}\n`;
        if (input.tripDate) msg += `📅 *תאריך:* ${input.tripDate}\n`;
        if (input.notes) msg += `📝 *פרטים:* ${input.notes}\n`;
        msg += `\nנשלח מהאתר אוטומטית`;

        const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`;
        return { success: true, whatsappUrl };
      }),
  }),
});

export type AppRouter = typeof appRouter;
