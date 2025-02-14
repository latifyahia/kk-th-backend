import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from '../pricing.service';
import { IUserCat } from 'src/user/types/user.interfaces';
import { EPouchePrice, EPoucheType } from '../types/pricing.enums';

describe('PricingService', () => {
  let pricingService: PricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricingService],
    }).compile();

    pricingService = module.get<PricingService>(PricingService);
  });

  it('should be defined', () => {
    expect(pricingService).toBeDefined();
  });

  it('should return 0 for an empty cats array', () => {
    const cats: IUserCat[] = [];
    const result =
      pricingService.calculateTotalPriceForActiveSubscriptionPouches(cats);

    expect(result).toBe(0);
  });

  it('should correctly calculate total price for a single cat', () => {
    const cats: IUserCat[] = [
      { pouchSize: EPoucheType.A }, //LY:NOTE - dummy object mock of IUserCat, overriding type definition to allow for testing
    ] as any as IUserCat[];
    const result =
      pricingService.calculateTotalPriceForActiveSubscriptionPouches(cats);

    expect(result).toBe(EPouchePrice.A);
  });

  it('should correctly calculate total price for multiple cats', () => {
    const cats: IUserCat[] = [
      { pouchSize: EPoucheType.A },
      { pouchSize: EPoucheType.B },
      { pouchSize: EPoucheType.C },
    ] as any as IUserCat[];
    const result =
      pricingService.calculateTotalPriceForActiveSubscriptionPouches(cats);
    const expectedTotal = EPouchePrice.A + EPouchePrice.B + EPouchePrice.C;

    expect(result).toBe(expectedTotal);
  });
});
