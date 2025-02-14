import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import * as fs from 'fs';

describe.only('UserService', () => {
  let userService: UserService;
  let mockUsers: any;
  let loggerSpy: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    mockUsers = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ];

    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockUsers));
    userService = module.get<UserService>(UserService);
    loggerSpy = {
      info: jest.spyOn(userService.logger, 'info'),
      warn: jest.spyOn(userService.logger, 'warn'),
      error: jest.spyOn(userService.logger, 'error'),
    };
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should call logger.info with correct arguments when fetching a user', () => {
    userService.getUserById('1');
    expect(loggerSpy.info).toHaveBeenCalledTimes(1);
    expect(loggerSpy.info).toHaveBeenCalledWith(
      { userId: '1', serviceName: 'UserService' },
      'Fetching user by userId',
    );
  });

  it('should call logger.warn with correct arguments when a user does not exist in our database', () => {
    userService.getUserById('3');
    expect(loggerSpy.warn).toHaveBeenCalledTimes(1);
    expect(loggerSpy.warn).toHaveBeenCalledWith(
      { userId: '3', serviceName: 'UserService' },
      'User not found',
    );
  });

  it('should return the user by userId if they exist', () => {
    const user = userService.getUserById('1');
    expect(user).toEqual({ id: '1', name: 'Alice' });
  });

  it('should return undefined if the user does not exist', () => {
    const user = userService.getUserById('3');
    expect(user).toBeUndefined();
  });
});
