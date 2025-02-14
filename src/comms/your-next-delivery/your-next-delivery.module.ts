import { Module } from '@nestjs/common';
import { YourNextDeliveryService } from './your-next-delivery.service';
import { YourNextDeliveryController } from './your-next-delivery.controller';
import { UserModule } from '../../user/user.module';
import { PricingModule } from '../../pricing/pricing.module';

@Module({
  imports: [UserModule, PricingModule],
  providers: [YourNextDeliveryService],
  controllers: [YourNextDeliveryController],
})
export class YourNextDeliveryModule {}
