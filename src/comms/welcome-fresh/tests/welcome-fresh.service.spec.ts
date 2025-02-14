import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeFreshService } from '../welcome-fresh.service';
import { UserModule } from '../../../user/user.module';
import { UserService } from '../../../user/user.service';
import { NotFoundException } from '@nestjs/common';

describe('WelcomeFreshService', () => {
  let welcomeFreshModule: TestingModule;
  let welcomeFreshService: WelcomeFreshService;
  let userService: UserService;
  let mockUser: any;

  beforeEach(async () => {
    welcomeFreshModule = await Test.createTestingModule({
      providers: [WelcomeFreshService],
      imports: [UserModule],
    }).compile();

    welcomeFreshService =
      welcomeFreshModule.get<WelcomeFreshService>(WelcomeFreshService);

    userService = welcomeFreshModule.get<UserService>(UserService);

    mockUser = {
      id: '123',
      firstName: 'John',
      cats: [
        {
          name: 'Whiskers',
        },
      ],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('welcomeFreshService should be defined', () => {
    expect(welcomeFreshService).toBeDefined();
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('buildResponseBody', () => {
    it('should throw a 404 NotFoundExpection error when the user is not found', async () => {
      jest.spyOn(userService, 'getUserById').mockReturnValue(undefined);

      try {
        await welcomeFreshService.buildResponseBody('123');
        fail('Expected a NotFoundException but the call did not throw');
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.getStatus()).toBe(404);
      }
    });

    it('should build the correct response when a user has 1 cat', async () => {
      mockUser.cats = [
        {
          name: 'Whisker',
        },
      ];
      jest.spyOn(userService, 'getUserById').mockReturnValue(mockUser);

      const result = await welcomeFreshService.buildResponseBody('123');
      expect(result).toEqual({
        message:
          "Welcome to KatKin, John! We're super excited for Whisker to join the KatKin club and start loving fresh!",
      });
    });

    it('should build the correct response when a user has 2 cat', async () => {
      mockUser.cats = [
        {
          name: 'Whisker',
        },
        { name: 'Fluffy' },
      ];
      jest.spyOn(userService, 'getUserById').mockReturnValue(mockUser);

      const result = await welcomeFreshService.buildResponseBody('123');
      expect(result).toEqual({
        message:
          "Welcome to KatKin, John! We're super excited for Whisker and Fluffy to join the KatKin club and start loving fresh!",
      });
    });

    it('should build the correct response when a user has mutiple cat', async () => {
      mockUser.cats = [
        {
          name: 'Whisker',
        },
        { name: 'Fluffy' },
        { name: 'Mary' },
        { name: 'Joe' },
        { name: 'Ethe' },
      ];
      jest.spyOn(userService, 'getUserById').mockReturnValue(mockUser);

      const result = await welcomeFreshService.buildResponseBody('123');
      expect(result).toEqual({
        message:
          "Welcome to KatKin, John! We're super excited for Whisker, Fluffy, Mary, Joe and Ethe to join the KatKin club and start loving fresh!",
      });
    });
  });
});
