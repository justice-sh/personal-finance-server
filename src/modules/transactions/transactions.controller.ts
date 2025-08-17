import { AuthUser } from "@/shared/types/guards";
import { TransactionsService } from "./transactions.service";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "@/common/guards/auth/auth.guard";

@Controller("transactions")
@UseGuards(AuthorizationGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(@Req() request: { user: AuthUser }) {
    const transactions = await this.transactionsService.findMany(request.user.id);
    return { message: "Transactions retrieved successfully", data: transactions };
  }
}
