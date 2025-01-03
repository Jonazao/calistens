import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb', // Database type
      host: 'localhost', // MongoDB host
      port: 27017, // MongoDB port
      database: 'test_db', // Replace with your database name
      useUnifiedTopology: true, // Recommended for MongoDB
      autoLoadEntities: true, // Automatically load entities
    }),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
