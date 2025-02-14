import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { YourNextDeliveryService } from './your-next-delivery.service';
import pino from 'pino';
import { IYourNextDeliveryResponse } from './types/your-next-delivery.interface';

@Controller('comms/your-next-delivery')
export class YourNextDeliveryController {
  logger: pino.Logger;
  constructor(
    private readonly yourNextDeliveryService: YourNextDeliveryService,
  ) {
    this.logger = pino();
  }

  /**
   * Handles the HTTP GET request to fetch the next-delivery details for a given user.
   *
   * @param userId - The UUID of the user for whom we are fetching the next delivery.
   *
   * @returns A promise that resolves to an `IYourNextDeliveryResponse` object with the following shape:
   * - **Success** (`200 OK` equivalent):
   *   ```json
   *   {
   *     "message": "...",
   *     "title": "...",
   *     "totalPrice": 123,  // optional
   *     "freeGift": true    // optional
   *   }
   *   ```
   * - **NotFoundException** (`404` equivalent):
   *   ```json
   *   {
   *     "message": "Resource not found"
   *   }
   *   ```
   * - **Internal Server Error** (`500` equivalent):
   *   ```json
   *   {
   *     "message": "Internal Server Error"
   *   }
   *   ```
   *
   * @throws {NotFoundException} If the user is not found in the system.
   * @throws {InternalServerErrorException} For any other errors that occur during processing.
   */
  @Get(':userId')
  async getYourNextDelivery(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<IYourNextDeliveryResponse> {
    try {
      const { message, title, totalPrice, freeGift } =
        await this.yourNextDeliveryService.buildResponseBody(userId);

      let response: IYourNextDeliveryResponse = {
        message,
        title,
      };

      if (totalPrice) {
        response.totalPrice = totalPrice;
      }

      if (freeGift !== undefined) {
        response.freeGift = freeGift;
      }

      this.logger.info({ userId, response }, 'Returned response to request');

      return response;
    } catch (error) {
      this.logger.error(
        { userId, error },
        'Error fetching your-next-delivery response',
      );
      /*
      LY:NOTE - For the take home assigment, we are only handling NotFoundException and throwing a 
      status 404 and every other error returns a status 500. In a real application, you would handle different 
      types of errors here. For different error types, we can return different messages, but 
      for now this will do!:)
      */
      if (error instanceof NotFoundException) {
        throw new NotFoundException({ message: 'Resource not found' });
      }

      throw new InternalServerErrorException({
        message: 'Internal server error',
      });
    }
  }
}
