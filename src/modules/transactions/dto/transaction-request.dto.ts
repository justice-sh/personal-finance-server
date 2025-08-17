import { RequiredKeys } from "@/shared/types/utils";
import { CreateTransaction } from "@/infrastructure/database/types";

export type CreateTransactionDto = RequiredKeys<CreateTransaction, "userId">;
