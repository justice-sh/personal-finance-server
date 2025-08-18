import { AuthUser } from "@/shared/types/guards";
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
  ) {
    const response = await this.transactionsService.findMany({
      userId: request.user.id,
      limit,
      offset,
      description: query,
      budgetId,
    });
    return { message: "Transactions retrieved successfully", data: response };
  }
}
