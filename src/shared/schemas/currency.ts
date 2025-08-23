import z from "zod";
import { Currency } from "../enum/currency";

export const CurrencySchema = z.preprocess(
  (value) => {
    if (typeof value === "string") return value.toUpperCase();
    return value;
  },
  z.enum(Object.values(Currency) as [Currency, ...Currency[]], {
    errorMap: (_error, ctx) => {
      return { message: `Unsupported currency: expected ${Object.values(Currency).join(" | ")}, received ${ctx.data}` };
    },
  }),
);
