import { Module } from '@nestjs/common';
import { YourNextDeliveryModule } from './your-next-delivery/your-next-delivery.module';
import { UserModule } from '../user/user.module';
import { PricingModule } from '../pricing/pricing.module';
import { WelcomeFreshModule } from './welcome-fresh/welcome-fresh.module';

@Module({
  imports: [
    YourNextDeliveryModule,
    UserModule,
    PricingModule,
    WelcomeFreshModule,
  ],
})
export class CommsModule {}
