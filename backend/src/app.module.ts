import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UserModule } from './features/user/user.module';
import { NftModule } from './features/nft/nft.module';
import { AuthModule } from './core/auth/auth.module';
import { SupabaseModule } from './core/database/supabase.module';
import { SharedModule } from './core/shared/shared.module';
import { TransactionModule } from './features/transaction/transaction.module';
import { CacheModule } from './core/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(3000),
      }),
    }),
    SupabaseModule,
    CacheModule,
    SharedModule,
    AuthModule,
    UserModule,
    NftModule,
    TransactionModule,
  ],
})
export class AppModule {}
