import { AuthUser } from "@/shared/types/guards";
import { TransactionSortBy } from "./enums/sort-by";
import { TransactionsService } from "./transactions.service";
import { AuthorizationGuard } from "@/common/guards/auth/auth.guard";
import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";

@Controller("transactions")
@UseGuards(AuthorizationGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(
    @Req() request: { user: AuthUser },
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
    @Query("query") query?: string,
    @Query("budgetId") budgetId?: string,
    @Query("sortBy") sortBy?: TransactionSortBy,
  ) {
    const response = await this.transactionsService.findMany({
      userId: request.user.id,
      limit,
      offset,
      description: query,
      budgetId,
      sortBy,
    });
    return { message: "Transactions retrieved successfully", data: response };
  }

  @Get("sort-by")
  async getSortBy() {
    const data = this.transactionsService.getSortBy();
    return { message: "Transaction sort-by values", data };
  }
}
