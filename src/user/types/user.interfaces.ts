import { EPouchePrice } from '../../pricing/types/pricing.enums';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  cats: IUserCat[];
}

export interface IUserCat {
  name: string;
  subscriptionActive: boolean;
  breed: string; //LY:NOTE - Ideally here we would have an ENUM with all the cat breeds!:)
  pouchSize: keyof typeof EPouchePrice;
}
