import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { JwtModule } from "./modules/jwt/jwt.module";
import { OtpModule } from "./modules/otp/otp.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ThemesModule } from "./modules/themes/themes.module";
import { ConfigModule } from "./modules/config/config.module";
import { BudgetsModule } from "./modules/budgets/budgets.module";
import { DatabaseModule } from "./modules/database/database.module";
import { CategoriesModule } from "./modules/categories/categories.module";

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    DatabaseModule,
    UsersModule,
    ConfigModule,
    OtpModule,
    JwtModule,
    AuthModule,
    BudgetsModule,
    ThemesModule,
    CategoriesModule,
  ],
})
export class AppModule {}
