import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScherma } from './schema/user.schema';
import { USER } from '../common/models/models';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: USER.name,
        useFactory: () => {
          return UserScherma;
        },
      },
    ]),


  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
