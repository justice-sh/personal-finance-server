import { AuthUser } from "@/shared/types/guards";
import { Currency } from "@/shared/enum/currency";
import { BalanceService } from "./balance.service";
import { CurrencySchema } from "@/shared/schemas/currency";
import { AuthorizationGuard } from "@/common/guards/auth/auth.guard";
import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "@/common/pipes/zod-validation/zod-validation.pipe";

@Controller("balance")
@UseGuards(AuthorizationGuard)
export class BalanceController {
  constructor(private readonly balanceSv: BalanceService) {}

  @Get(":currency")
  async getBalances(
    @Req() request: { user: AuthUser },
    @Param("currency", new ZodValidationPipe(CurrencySchema)) currency: Currency,
  ) {
    const data = await this.balanceSv.getBalance(request.user.id, currency);
    return { message: "Balances retrieved successfully", data };
  }
}
