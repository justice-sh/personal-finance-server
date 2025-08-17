import { TransactionStatus, TransactionType } from "@/shared/enum/transaction";

export type TransactionResponse = {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  category: string;
  createdAt: Date;
  description: string;
};
