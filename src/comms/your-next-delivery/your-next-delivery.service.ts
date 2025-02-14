import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { formatCatNames } from '../../common/utils/string.util';
import { PricingService } from '../../pricing/pricing.service';
import { IYourNextDeliveryResponse } from './types/your-next-delivery.interface';
import { IUser, IUserCat } from '../../user/types/user.interfaces';
import { getCatsWithActiveSub } from '../../common/utils/cat.util';
import pino from 'pino';

@Injectable()
export class YourNextDeliveryService {
  logger: pino.Logger;
  private serviceName: string = 'YourNextDeliveryService';
  constructor(
    private readonly userService: UserService,
    private readonly pricingService: PricingService,
  ) {
    this.logger = pino();
  }

  /**
   * Builds the "Your Next Delivery" response body for a given user.
   *
   * This method:
   * - Fetches the user data by ID.
   * - Determines if the user has any active cat subscriptions.
   * - Returns a response object containing a `title` and `message`.
   *   - If there are no active subscriptions, only `title` and `message` are included.
   *   - If there are active subscriptions, also includes `totalPrice` and `freeGift`.
   *
   * @param userId - The unique identifier of the user for whom we build the response body.
   * @returns A promise that resolves to a `IYourNextDeliveryResponse` object:
   *   - When no active subscriptions exist:
   *     ```json
   *     {
   *       "title": "Hmmm... It looks like you have no active subscriptions",
   *       "message": "Set up a subscription to receive your next delivery"
   *     }
   *     ```
   *   - When active subscriptions exist:
   *     ```json
   *     {
   *       "title": "...",
   *       "message": "...",
   *       "totalPrice": 123,
   *       "freeGift": true
   *     }
   *     ```
   *
   * @throws {NotFoundException} If the user does not exist in the system.
   */
  async buildResponseBody(userId: string): Promise<IYourNextDeliveryResponse> {
    this.logger.info(
      { userId, serviceName: this.serviceName },
      'Building response body',
    );

    let response: IYourNextDeliveryResponse = {
      title: '',
      message: '',
    };

    const user: IUser | undefined = this.userService.getUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const catsWithActiveSubscription = getCatsWithActiveSub(user.cats);

    if (catsWithActiveSubscription.length === 0) {
      this.logger.warn(
        { userId, serviceName: this.serviceName },
        'User has no active subscriptions',
      );
      response.title = 'Hmmm... It looks like you have no active subscriptions';
      response.message = 'Set up a subscription to receive your next delivery';
      this.logger.info(
        { userId, serviceName: this.serviceName, response },
        'Built response',
      );
      return response;
    }

    response.title = this.buildTitle(catsWithActiveSubscription);
    response.message = this.buildMessage(
      user.firstName,
      catsWithActiveSubscription,
    );
    response.totalPrice = this.buildTotalPrice(catsWithActiveSubscription);
    response.freeGift = response.totalPrice > 120 ? true : false;

    this.logger.info(
      { userId, serviceName: this.serviceName, response },
      'Built response body',
    );

    return response;
  }

  /**
   * Constructs the `title` string for the next-delivery response
   * by concatenating a base message with the formatted cat names.
   *
   * @param cats - An array of `IUserCat` objects for which the user has an active subscription.
   *
   * @returns A string of the form `Your next delivery for [cat names]`.
   */
  private buildTitle(cats: IUserCat[]): string {
    const message = 'Your next delivery for ';
    const formattedCats = formatCatNames(cats);
    return message + formattedCats;
  }

  /**
   * Constructs the `message` string for the next-delivery response,
   * including the user's first name and formatted cat names.
   *
   * @param name - The first name of the user.
   * @param cats - An array of `IUserCat` objects for which the user has an active subscription.
   *
   * @returns A string of the form `Hey [name]! In two days' time, we'll be charging you for ...`.
   */
  private buildMessage(name: string, cats: IUserCat[]): string {
    return `Hey ${name}! In two days' time, we'll be charging you for your next order for ${formatCatNames(cats, true)} fresh food.`;
  }

  /**
   * Calculates the total subscription price for a set of cat subscriptions.
   *
   * @param cats - An array of `IUserCat` objects for which the user has an active subscription.
   *
   * @returns The sum of the prices (in numeric form) for all active cat subscription pouches.
   */
  private buildTotalPrice(cats: IUserCat[]): number {
    return this.pricingService.calculateTotalPriceForActiveSubscriptionPouches(
      cats,
    );
  }
}
