import { BudgetsService } from "./budgets.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("BudgetsService", () => {
  let service: BudgetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetsService],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
