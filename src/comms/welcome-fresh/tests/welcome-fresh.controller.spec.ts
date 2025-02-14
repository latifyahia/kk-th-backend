import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeFreshController } from '../welcome-fresh.controller';
import { WelcomeFreshService } from '../welcome-fresh.service';
import { UserModule } from '../../../user/user.module';
import { UserService } from '../../../user/user.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('WelcomeFreshController', () => {
  let welcomeFreshController: WelcomeFreshController;
  let welcomeFreshModule: TestingModule;
  let welcomeFreshService: WelcomeFreshService;
  let userService: UserService;
  let loggerSpy: any;

  beforeEach(async () => {
    welcomeFreshModule = await Test.createTestingModule({
      controllers: [WelcomeFreshController],
      providers: [WelcomeFreshService],
      imports: [UserModule],
    }).compile();

    welcomeFreshController = welcomeFreshModule.get<WelcomeFreshController>(
      WelcomeFreshController,
    );
    welcomeFreshService =
      welcomeFreshModule.get<WelcomeFreshService>(WelcomeFreshService);
    userService = welcomeFreshModule.get<UserService>(UserService);

    loggerSpy = {
      info: jest.spyOn(welcomeFreshController.logger, 'info'),
      warn: jest.spyOn(welcomeFreshController.logger, 'warn'),
      error: jest.spyOn(welcomeFreshController.logger, 'error'),
    };
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('WelcomeFreshController should be defined', () => {
    expect(welcomeFreshController).toBeDefined();
  });
  it('WelcomeFreshService should be defined', () => {
    expect(welcomeFreshService).toBeDefined();
  });
  it('UserService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getWelcomeFresh', () => {
    it('should return statusCode 200 on a valid request', async () => {
      const expectedResultBody = {
        message:
          "Welcome to KatKin, John! We're super excited for Whisker to join the KatKin club and start loving fresh!",
      };
      jest
        .spyOn(welcomeFreshService, 'buildResponseBody')
        .mockResolvedValue(expectedResultBody);

      const result = await welcomeFreshController.getWelcomeFresh('123');
      expect(result).toEqual(expectedResultBody);
    });

    it('should create a info log when returning a valid response', async () => {
      const expectedResultBody = {
        message:
          "Welcome to KatKin, John! We're super excited for Whisker to join the KatKin club and start loving fresh!",
      };
      jest
        .spyOn(welcomeFreshService, 'buildResponseBody')
        .mockResolvedValue(expectedResultBody);

      await welcomeFreshController.getWelcomeFresh('123');
      expect(loggerSpy.info).toHaveBeenCalledTimes(1);
      expect(loggerSpy.info).toHaveBeenCalledWith(
        {
          userId: '123',
          response: expectedResultBody,
        },
        'Returned response to request',
      );
    });

    it('should create a error log when an error is caught', async () => {
      jest
        .spyOn(welcomeFreshService, 'buildResponseBody')
        .mockRejectedValue(new NotFoundException());

      try {
        await welcomeFreshController.getWelcomeFresh('123');
        fail('Expected a NotFoundException but the call did not throw');
      } catch (error: any) {
        expect(loggerSpy.error).toHaveBeenCalledTimes(1);
        expect(loggerSpy.error).toHaveBeenCalledWith(
          {
            userId: '123',
            error: new NotFoundException(),
          },
          'Error fetching welcome-fresh response',
        );
      }
    });

    it('should return a 404 "Resource not found" when a NotFoundException is thrown', async () => {
      jest
        .spyOn(welcomeFreshService, 'buildResponseBody')
        .mockRejectedValue(new NotFoundException());

      try {
        await welcomeFreshController.getWelcomeFresh('123');
        fail('Expected a NotFoundException but the call did not throw');
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.getStatus()).toBe(404);
        expect(error.getResponse()).toEqual({ message: 'Resource not found' });
      }
    });

    it('should return a 500 "Interal server error" when any error not of type NotFoundException is thrown', async () => {
      jest
        .spyOn(welcomeFreshService, 'buildResponseBody')
        .mockRejectedValue(new InternalServerErrorException());

      try {
        await welcomeFreshController.getWelcomeFresh('123');
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
