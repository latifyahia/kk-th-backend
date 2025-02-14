import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { IUser, IUserCat } from 'src/user/types/user.interfaces';
import { formatCatNames } from '../../common/utils/string.util';
import { IWelcomeFreshResponse } from './types/welcome-fresh.interfaces';
import pino from 'pino';

@Injectable()
export class WelcomeFreshService {
  logger: pino.Logger;
  private serviceName: string = 'WelcomeFreshService';

  constructor(private readonly userService: UserService) {
    this.logger = pino();
  }
  /**
   * Builds a welcome message for a given user ID.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to an object containing the welcome message.
   *
   * @throws {NotFoundException} If no user with the given ID is found.
   * @throws {InternalServerErrorException} For any unexpected error.
   */
  async buildResponseBody(userId: string): Promise<IWelcomeFreshResponse> {
    let response: IWelcomeFreshResponse = {
      message: '',
    };

    this.logger.info(
      { userId, serviceName: this.serviceName },
      'Building response body',
    );

    const user: IUser | undefined = this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    response.message = this.buildMessage(user.firstName, user.cats);

    this.logger.info(
      { userId, serviceName: this.serviceName, response },
      'Built response body',
    );
    return response;
  }

  /**
   * Builds a personalized welcome message including the user's name and cats.
   *
   * @param user - The user object containing information such as `firstName`.
   * @param cats - An array of `IUserCat` objects representing the user's cats.
   * @returns A string that welcomes the user and references their cats by name.
   */
  private buildMessage(name: string, cats: IUserCat[]): string {
    return `Welcome to KatKin, ${name}! We're super excited for ${formatCatNames(cats)} to join the KatKin club and start loving fresh!`;
  }
}
