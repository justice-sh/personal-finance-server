import { AuthUser } from "@/shared/types/guards";
import { BudgetsService } from "./budgets.service";
import { CreateBudgetDto } from "./dto/budget.request.dto";
import { AuthorizationGuard } from "@/common/guards/auth/auth.guard";
import { ZodValidationPipe } from "@/common/pipes/zod-validation/zod-validation.pipe";
import { Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards, UsePipes } from "@nestjs/common";

@Controller("budgets")
@UsePipes(new ZodValidationPipe())
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  async getBudgets(@Req() request: { user: AuthUser }) {
    const budgets = await this.budgetsService.findMany(request.user.id);
    const data = budgets.map((b) => this.budgetsService.toResponse(b));
    return { message: "Budgets retrieved successfully", data };
  }

  @Get(":id")
  @UseGuards(AuthorizationGuard)
  async getBudget(@Param("id") budgetId: string, @Req() request: { user: AuthUser }) {
    const budget = await this.budgetsService.findOne(budgetId);
    if (!budget) throw new NotFoundException("Budget not found");
    return { message: "Budget retrieved successfully", data: this.budgetsService.toResponse(budget) };
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  async createBudget(@Body() data: CreateBudgetDto, @Req() request: { user: AuthUser }) {
    const budget = await this.budgetsService.create({ ...data, userId: request.user.id });
    return { message: "Budget created successfully", data: this.budgetsService.toResponse(budget) };
  }
}
