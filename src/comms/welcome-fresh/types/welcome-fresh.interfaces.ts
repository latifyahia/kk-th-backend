import { IAPIResponse } from 'src/common/types/common.interfaces';

export interface IWelcomeFreshResponse
  extends Omit<IAPIResponse, 'error' | 'title' | 'totalPrice' | 'freeGift'> {}
