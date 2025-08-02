import { Color } from "@/shared/enum/color";

export type BudgetResponse = {
  id: string;
  color: Color;
  category: string;
  maxAmount: number;
  createdAt: Date;
  updatedAt: Date;
  currentAmount: number;
  spent: number;
};
