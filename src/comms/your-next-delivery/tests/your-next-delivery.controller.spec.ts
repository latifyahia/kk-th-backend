import { Test, TestingModule } from '@nestjs/testing';
import { YourNextDeliveryController } from '../your-next-delivery.controller';
import { YourNextDeliveryService } from '../your-next-delivery.service';
import { UserService } from '../../../user/user.service';
import { PricingService } from '../../../pricing/pricing.service';
import { UserModule } from '../../../user/user.module';
import { PricingModule } from '../../../pricing/pricing.module';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('YourNextDeliveryController', () => {
  let yourNextDeliveryModule: TestingModule;
  let yourNextDeliveryController: YourNextDeliveryController;
  let yourNextDeliveryService: YourNextDeliveryService;
  let userService: UserService;
  let pricingService: PricingService;
  let loggerSpy: any;

  beforeEach(async () => {
    yourNextDeliveryModule = await Test.createTestingModule({
      controllers: [YourNextDeliveryController],
      providers: [YourNextDeliveryService],
      imports: [UserModule, PricingModule],
    }).compile();

    yourNextDeliveryController =
      yourNextDeliveryModule.get<YourNextDeliveryController>(
        YourNextDeliveryController,
      );
    yourNextDeliveryService =
      yourNextDeliveryModule.get<YourNextDeliveryService>(
        YourNextDeliveryService,
      );
    userService = yourNextDeliveryModule.get<UserService>(UserService);
    pricingService = yourNextDeliveryModule.get<PricingService>(PricingService);
    loggerSpy = {
      info: jest.spyOn(yourNextDeliveryController.logger, 'info'),
      warn: jest.spyOn(yourNextDeliveryController.logger, 'warn'),
      error: jest.spyOn(yourNextDeliveryController.logger, 'error'),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('YourNextDeliveryController should be defined', () => {
    expect(yourNextDeliveryController).toBeDefined();
  });

  it('YourNextDeliveryService should be defined', () => {
    expect(yourNextDeliveryService).toBeDefined();
  });

  it('UserService should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('PricingService should be defined', () => {
    expect(pricingService).toBeDefined();
  });

  describe('getYourNextDelivery', () => {
    it('should return statusCode 200 on a valid request', async () => {
      const expectedResultBody = {
        title: 'Your next delivery for Whiskers, Fluffy',
        message:
          "Hey John! In two days' time, we'll be charging you for your next order for Whiskers, Fluffy fresh food.",
        totalPrice: 60,
        freeGift: false,
      };
      jest
        .spyOn(yourNextDeliveryService, 'buildResponseBody')
        .mockResolvedValue(expectedResultBody);

      const result =
        await yourNextDeliveryController.getYourNextDelivery('123');
      expect(result).toEqual(expectedResultBody);
    });

    it('should create a info log when returning a valid response', async () => {
      const expectedResultBody = {
        title: 'Your next delivery for Whiskers, Fluffy',
        message:
          "Hey John! In two days' time, we'll be charging you for your next order for Whiskers, Fluffy fresh food.",
        totalPrice: 60,
        freeGift: false,
      };
      jest
        .spyOn(yourNextDeliveryService, 'buildResponseBody')
        .mockResolvedValue(expectedResultBody);

      await yourNextDeliveryController.getYourNextDelivery('123');
      expect(loggerSpy.info).toHaveBeenCalledTimes(1);
      expect(loggerSpy.info).toHaveBeenCalledWith(
        {
          userId: '123',
          response: expectedResultBody,
        },
        'Returned response to request',
      );
    });

    it('should create a error log when am error is caught', async () => {
      jest
        .spyOn(yourNextDeliveryService, 'buildResponseBody')
        .mockRejectedValue(new NotFoundException());

      try {
        await yourNextDeliveryController.getYourNextDelivery('123');
        fail('Expected a NotFoundException but the call did not throw');
      } catch (error: any) {
        expect(loggerSpy.error).toHaveBeenCalledTimes(1);
        expect(loggerSpy.error).toHaveBeenCalledWith(
          {
            userId: '123',
            error: new NotFoundException(),
          },
          'Error fetching your-next-delivery response',
        );
      }
    });

    it('should return a 404 "Resource not found" when a NotFoundException is thrown', async () => {
      jest
        .spyOn(yourNextDeliveryService, 'buildResponseBody')
        .mockRejectedValue(new NotFoundException());

      try {
        await yourNextDeliveryController.getYourNextDelivery('123');
        fail('Expected a NotFoundException but the call did not throw');
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.getStatus()).toBe(404);
        expect(error.getResponse()).toEqual({ message: 'Resource not found' });
      }
    });

    it('should return a 500 "Interal server error" when any error not of type NotFoundException is thrown', async () => {
      jest
        .spyOn(yourNextDeliveryService, 'buildResponseBody')
        .mockRejectedValue(new InternalServerErrorException());

      try {
        await yourNextDeliveryController.getYourNextDelivery('123');
        fail(
          'Expected a InternalServerErrorException but the call did not throw',
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.getStatus()).toBe(500);
        expect(error.getResponse()).toEqual({
          message: 'Internal server error',
        });
      }
    });
  });
});
