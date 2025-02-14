import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { IUser } from './types/user.interfaces';
import pino from 'pino';

@Injectable()
/**
 * This class is responsible for fetching user data from the database
 */
export class UserService {
  private db: { users: IUser[] };
  private serviceName: string;
  logger: pino.Logger;

  constructor() {
    //LY:NOTE - This is a mock database. In a real application, you would initialize a connection to your database here and userDb would be an instance of your real database.
    this.db = { users: JSON.parse(fs.readFileSync('./data.json', 'utf-8')) };
    this.serviceName = 'UserService';
    this.logger = pino();
  }

  /**
   * This function fetches a user by their userId from the database
   *
   * @param userId The userId we are fetching
   *
   * @returns The user record or undefined if the user does not exist
   */
  getUserById(userId: string): IUser | undefined {
    this.logger.info(
      { userId, serviceName: this.serviceName },
      'Fetching user by userId',
    );
    const userRecord = this.db.users.find((user: any) => user.id === userId);

    if (!userRecord) {
      this.logger.warn(
        { userId, serviceName: this.serviceName },
        'User not found',
      );
      return;
    }

    return userRecord;
  }
}
