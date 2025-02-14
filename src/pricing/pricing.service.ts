import { Injectable } from '@nestjs/common';
import { EPouchePrice } from './types/pricing.enums';
import { IUserCat } from 'src/user/types/user.interfaces';

@Injectable()
export class PricingService {
  /**
   *
   * @param cats List containing users cats with active subscription
   * @returns Total price of all pouches for cats with active subscription
   */
  calculateTotalPriceForActiveSubscriptionPouches(cats: IUserCat[]): number {
    //LY:NOTE TO KATKIN - Within the instruction, it mentions the response -> totalPrice should be 66.00 (number)
    // This is a small bug within the instructions as if the totalPrice calculated contains any trailing 0's, TS will disgrade any trailing 0s, and we can not include
    // the trailing 0s in the response unless we return the total price as a string, but in your instructions its a number.
    // E.G 66.00 will be returned as 66, 66.50 will be returned as 66.5, 66.55 will be returned as 66.55g
    const result = cats.reduce((total: number, cat: IUserCat) => {
      return total + EPouchePrice[cat.pouchSize];
    }, 0);
    return result;
  }
}
