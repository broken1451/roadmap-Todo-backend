import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TodolistModule } from './todolist/todolist.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: process.env.MONGODB_DATABASE,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
    }),
    AuthModule, 
    TodolistModule,
    ThrottlerModule.forRoot([
      {
        limit: 5,
        ttl: 60,
      }
    ])
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
