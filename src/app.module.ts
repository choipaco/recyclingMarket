import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ormConfig } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationModule } from './configuration/configuration.module';
import { JwtModule } from '@nestjs/jwt';
import { BoardModule } from './board/board.module';
@Module({
  imports: [
    JwtModule.register({
      // secret: process.env.SECRET_TOKEN
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_SCHEMA,
      synchronize: false,
      logging: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
  }),
    AuthModule,
    BoardModule,
    ConfigurationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
