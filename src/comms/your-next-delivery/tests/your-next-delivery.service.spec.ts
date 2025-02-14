import { Test, TestingModule } from '@nestjs/testing';
import { YourNextDeliveryService } from '../your-next-delivery.service';
import { UserService } from '../../../user/user.service';
import { PricingService } from '../../../pricing/pricing.service';
import {
  EPouchePrice,
  EPoucheType,
} from '../../../pricing/types/pricing.enums';
import { NotFoundException } from '@nestjs/common';

describe('YourNextDeliveryService', () => {
  let yourNextDeliveryService: YourNextDeliveryService;
  let userService: UserService;
  let pricingService: PricingService;
  let loggerSpy: any;
  let yourNextDeliveryModule: TestingModule;
  let mockUser: any;

  beforeEach(async () => {
    yourNextDeliveryModule = await Test.createTestingModule({
      providers: [
        YourNextDeliveryService,
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
        {
          provide: PricingService,
          useValue: {
            calculateTotalPriceForActiveSubscriptionPouches: jest.fn(),
          },
        },
      ],
    }).compile();

    yourNextDeliveryService =
      yourNextDeliveryModule.get<YourNextDeliveryService>(
        YourNextDeliveryService,
      );
    userService = yourNextDeliveryModule.get<UserService>(UserService);
    pricingService = yourNextDeliveryModule.get<PricingService>(PricingService);

    loggerSpy = {
      info: jest.spyOn(yourNextDeliveryService.logger, 'info'),
      warn: jest.spyOn(yourNextDeliveryService.logger, 'warn'),
      error: jest.spyOn(yourNextDeliveryService.logger, 'error'),
    };

    mockUser = {
      id: '123',
      firstName: 'John',
      cats: [
        {
          name: 'Whiskers',
          pouchSize: EPoucheType.A,
          subscriptionActive: false,
        },
      ],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('YourNextDeliveryService should be defined', () => {
    expect(yourNextDeliveryService).toBeDefined();
  });

  it('UserService should be defined', () => {
    expect(yourNextDeliveryService).toBeDefined();
  });

  it('PricingService should be defined', () => {
    expect(pricingService).toBeDefined();
  });

  describe('buildResponseBody', () => {
    it('should throw a 404 NotFoundExpection error when the user is not found', async () => {
      jest.spyOn(userService, 'getUserById').mockReturnValue(undefined);

      try {
        await yourNextDeliveryService.buildResponseBody('123');
        fail('Expected a NotFoundException but the call did not throw');
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.getStatus()).toBe(404);
      }
    });

    it('should build and return a custom response when a user has not cats with an active subscribion', async () => {
      jest.spyOn(userService, 'getUserById').mockReturnValue(mockUser);
      const result = await yourNextDeliveryService.buildResponseBody('123');
      expect(result).toEqual({
        title: 'Hmmm... It looks like you have no active subscriptions',
        message: 'Set up a subscription to receive your next delivery',
      });
    });

    it('should build the correct response when a user has 1 active cat subcription ', async () => {
      mockUser.cats = [
        {
          name: 'Whisker',
          pouchSize: EPoucheType.A,
          subscriptionActive: false,
        },
        { name: 'Fluffy', pouchSize: EPoucheType.E, subscriptionActive: true },
      ];
      jest.spyOn(userService, 'getUserById').mockReturnValue(mockUser);
      jest
        .spyOn(
          pricingService,
          'calculateTotalPriceForActiveSubscriptionPouches',
        )
        .mockReturnValue(EPouchePrice.E);

      const result = await yourNextDeliveryService.buildResponseBody('123');
      expect(result).toEqual({
        title: `Your next delivery for Fluffy`,
        message:
          "Hey John! In two days' time, we'll be charging you for your next order for Fluffy's fresh food.",
        totalPrice: EPouchePrice.E,
        freeGift: false,
      });
    });

    it('should build the correct response when a user has 2 active cat subcription ', async () => {
      mockUser.cats = [
        {
          name: 'Whisker',
          pouchSize: EPoucheType.A,
          subscriptionActive: false,
        },
        { name: 'Fluffy', pouchSize: EPoucheType.E, subscriptionActive: true },
        { name: 'Mary', pouchSize: EPoucheType.B, subscriptionActive: true },
      ];
      jest.spyOn(userService, 'getUserById').mockReturnValue(mockUser);
      jest
        .spyOn(
          pricingService,
          'calculateTotalPriceForActiveSubscriptionPouches',
        )
        .mockReturnValue(EPouchePrice.E + EPouchePrice.B);

      const result = await yourNextDeliveryService.buildResponseBody('123');
      expect(result).toEqual({
        title: `Your next delivery for Fluffy and Mary`,
        message:
          "Hey John! In two days' time, we'll be charging you for your next order for Fluffy and Mary's fresh food.",
        totalPrice: EPouchePrice.E + EPouchePrice.B,
        freeGift: true,
      });
    });

    it('should build the correct response when a user has mutiple active cat subcription', async () => {
      mockUser.cats = [
        {
          name: 'Whisker',
          pouchSize: EPoucheType.A,
          subscriptionActive: false,
        },
        { name: 'Fluffy', pouchSize: EPoucheType.E, subscriptionActive: true },
        { name: 'Mary', pouchSize: EPoucheType.B, subscriptionActive: true },
        { name: 'Joe', pouchSize: EPoucheType.C, subscriptionActive: true },
        { name: 'Ethe', pouchSize: EPoucheType.A, subscriptionActive: true },
      ];
      jest.spyOn(userService, 'getUserById').mockReturnValue(mockUser);
      jest
        .spyOn(
          pricingService,
          'calculateTotalPriceForActiveSubscriptionPouches',
        )
        .mockReturnValue(
          EPouchePrice.E + EPouchePrice.B + EPouchePrice.C + EPouchePrice.A,
        );

      const result = await yourNextDeliveryService.buildResponseBody('123');
      expect(result).toEqual({
        title: `Your next delivery for Fluffy, Mary, Joe and Ethe`,
        message:
          "Hey John! In two days' time, we'll be charging you for your next order for Fluffy, Mary, Joe and Ethe's fresh food.",
        totalPrice:
          EPouchePrice.E + EPouchePrice.B + EPouchePrice.C + EPouchePrice.A,
        freeGift: true,
      });
    });
  });
});
