import { Color } from "@/shared/enum/color";
import { Currency } from "@/shared/enum/currency";

export type BudgetResponse = {
  id: string;
  color: Color;
  category: string;
  maxSpend: number;
  createdAt: Date;
  updatedAt: Date;
  currentAmount: number;
  spent: number;
  currency: Currency;
};
