import {
  Get,
  Req,
  Put,
  Body,
  Post,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  Controller,
  NotFoundException,
} from "@nestjs/common";
import { AuthUser } from "@/shared/types/guards";
import { BudgetsService } from "./budgets.service";
import { AuthorizationGuard } from "@/common/guards/auth/auth.guard";
import { CreateBudgetDto, UpdateBudgetDto } from "./dto/budget.request.dto";
import { ZodValidationPipe } from "@/common/pipes/zod-validation/zod-validation.pipe";

@Controller("budgets")
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
    const budget = await this.budgetsService.findOne({ id: budgetId, userId: request.user.id });
    if (!budget) throw new NotFoundException("Budget not found");
    return { message: "Budget retrieved successfully", data: this.budgetsService.toResponse(budget) };
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @UsePipes(new ZodValidationPipe(CreateBudgetDto))
  async createBudget(@Body() data: CreateBudgetDto, @Req() request: { user: AuthUser }) {
    const budget = await this.budgetsService.create({ ...data, userId: request.user.id });
    return { message: "Budget created successfully", data: this.budgetsService.toResponse(budget) };
  }

  @Put(":id")
  @UseGuards(AuthorizationGuard)
  @UsePipes(new ZodValidationPipe())
  async updateBudget(@Body() data: UpdateBudgetDto, @Param("id") budgetId: string, @Req() request: { user: AuthUser }) {
    const budget = await this.budgetsService.update({ id: budgetId, userId: request.user.id, ...data });
    return { message: "Budget updated successfully", data: this.budgetsService.toResponse(budget) };
  }

  @Delete(":id")
  @UseGuards(AuthorizationGuard)
  async deleteBudget(@Param("id") budgetId: string, @Req() request: { user: AuthUser }) {
    await this.budgetsService.delete(budgetId, request.user.id);
    return { message: "Budget deleted successfully" };
  }
}
