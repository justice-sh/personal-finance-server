import { AuthUser } from "@/shared/types/guards";
import { CategoriesService } from "./categories.service";
import { AuthorizationGuard } from "@/common/guards/auth/auth.guard";
import { Controller, Get, Req, UseGuards, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@/common/pipes/zod-validation/zod-validation.pipe";

@Controller("categories")
@UsePipes(new ZodValidationPipe())
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  async getCategories(@Req() request: { user: AuthUser }) {
    const data = await this.categoriesService.getManyByUserId(request.user.id);
    return { message: "Categories retrieved successfully", data };
  }
}
