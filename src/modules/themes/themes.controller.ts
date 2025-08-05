import { AuthUser } from "@/shared/types/guards";
import { ThemesService } from "./themes.service";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "@/common/guards/auth/auth.guard";

@Controller("themes")
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  async getThemes(@Req() request: { user: AuthUser }) {
    const themes = await this.themesService.findMany(request.user.id);
    const data = this.themesService.toResponse(themes);
    return { message: "Themes retrieved successfully", data };
  }
}
