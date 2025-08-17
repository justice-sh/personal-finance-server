import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { JwtModule } from "./common/jwt/jwt.module";
import { OtpModule } from "./modules/otp/otp.module";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ThemesModule } from "./modules/themes/themes.module";
import { BudgetsModule } from "./modules/budgets/budgets.module";
import { CacheModule } from "./infrastructure/cache/cache.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";

@Module({
  imports: [
    OtpModule,
    JwtModule,
    AuthModule,
    UsersModule,
    CacheModule,
    ConfigModule,
    ThemesModule,
    BudgetsModule,
    DatabaseModule,
    CategoriesModule,
    TransactionsModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
