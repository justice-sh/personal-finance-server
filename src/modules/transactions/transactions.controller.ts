import { AuthUser } from "@/shared/types/guards";
import { TransactionSortBy } from "./enums/sort-by";
import { TransactionsService } from "./transactions.service";
import { AuthorizationGuard } from "@/common/guards/auth/auth.guard";
import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { TransactionStatus, TransactionType } from "@/shared/enum/transaction";

@Controller("transactions")
@UseGuards(AuthorizationGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(
    @Req() request: { user: AuthUser },
    @Query("limit") limit?: number,
    @Query("query") query?: string,
    @Query("offset") offset?: number,
    @Query("budgetId") budgetId?: string,
    @Query("type") type?: TransactionType,
    @Query("sortBy") sortBy?: TransactionSortBy,
    @Query("status") status?: TransactionStatus,
  ) {
    const response = await this.transactionsService.findMany({
      budgetId,
      description: query,
      userId: request.user.id,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      type: type?.toUpperCase() as TransactionType,
      sortBy: sortBy?.toUpperCase() as TransactionSortBy,
      status: status?.toUpperCase() as TransactionStatus,
    });
    return { message: "Transactions retrieved successfully", data: response };
  }

  @Get("sort-by")
  async getSortBy() {
    const data = this.transactionsService.getSortBy();
    return { message: "Transaction sort-by values", data };
  }
}
