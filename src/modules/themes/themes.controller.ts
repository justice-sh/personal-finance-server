import { AuthUser } from "@/shared/types/guards";
import { ThemesService } from "./themes.service";
import { AuthorizationGuard } from "@/common/guards/auth/auth.guard";
import { Controller, Get, Req, UseGuards, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@/common/pipes/zod-validation/zod-validation.pipe";

@Controller("themes")
@UsePipes(new ZodValidationPipe())
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  async getThemes(@Req() request: { user: AuthUser }) {
    const themes = await this.themesService.findMany(request.user.id);
    const data = this.themesService.combinePresets(themes);
    return { message: "Themes retrieved successfully", data };
  }
}
