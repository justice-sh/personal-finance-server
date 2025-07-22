import { AuthUser } from "@/types/guards";
import { CreateBudgetDto } from "./budget.dto";
import { BudgetsService } from "./budgets.service";
import { AuthorizationGuard } from "@/guards/auth/auth.guard";
import { ZodValidationPipe } from "@/pipes/zod-validation/zod-validation.pipe";
import { Body, Controller, Get, Post, Req, UseGuards, UsePipes } from "@nestjs/common";

@Controller("budgets")
@UsePipes(new ZodValidationPipe())
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  async getBudgets(@Req() request: { user: AuthUser }) {
    const budgets = await this.budgetsService.findByUserId(request.user.id);
    return {
      message: "Budgets retrieved successfully",
      data: budgets.map((b) => this.budgetsService.getPublicData(b)),
    };
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  async createBudget(@Body() data: CreateBudgetDto, @Req() request: { user: AuthUser }) {
    const budget = await this.budgetsService.create({ ...data, userId: request.user.id });
    return { message: "Budget created successfully", data: this.budgetsService.getPublicData(budget) };
  }
}
