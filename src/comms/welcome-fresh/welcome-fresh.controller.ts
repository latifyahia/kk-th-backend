import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WelcomeFreshService } from './welcome-fresh.service';
import { IWelcomeFreshResponse } from './types/welcome-fresh.interfaces';
import pino from 'pino';

@Controller('comms/welcome-fresh')
export class WelcomeFreshController {
  logger: pino.Logger;
  constructor(private readonly welcomeFreshService: WelcomeFreshService) {
    this.logger = pino();
  }
  /**
   * Handles the HTTP GET request to retrieve a "welcome-fresh" response for a specified user.
   *
   * @param userId - A UUID string representing the userId. Validated by `ParseUUIDPipe`.
   *
   * @returns An `IWelcomeFreshResponse` object containing:
   *           - `message`: The welcome text for the user.
   *
   * @throws {NotFoundException} If the user is not found in the system.
   * @throws {InternalServerErrorException} For any other errors that occur during processing.
   */
  @Get(':userId')
  async getWelcomeFresh(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<IWelcomeFreshResponse> {
    try {
      const { message } =
        await this.welcomeFreshService.buildResponseBody(userId);

      let response: IWelcomeFreshResponse = {
        message,
      };

      this.logger.info({ userId, response }, 'Returned response to request');
      return response;
    } catch (error: any) {
      this.logger.error(
        { userId, error },
        'Error fetching welcome-fresh response',
      );
      /*
      LY:NOTE - For the take home assigment, we are only handling NotFoundException and throwing a 
      status 404 and every other error returns a status 500. In a real application, you would handle different 
      types of errors here. For different error types, we can return different statuses, but 
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
