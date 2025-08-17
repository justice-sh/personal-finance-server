import { Currency } from "@/shared/enum/currency";
import { pgEnum } from "drizzle-orm/pg-core/columns/enum";

export const currency = pgEnum("currency", Object.values(Currency) as [Currency, ...Currency[]]);
