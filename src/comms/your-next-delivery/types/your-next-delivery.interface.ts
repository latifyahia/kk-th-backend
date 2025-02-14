import { IAPIResponse } from 'src/common/types/common.interfaces';

export interface IYourNextDeliveryResponse
  extends Omit<IAPIResponse, 'error'> {}
