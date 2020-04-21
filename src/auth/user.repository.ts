import { Repository, EntityRepository } from "typeorm";
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { User } from "./user.entity";
import { InternalServerErrorException, ConflictException } from "@nestjs/common";
import { TypeormErrorCode } from "src/shared/typeorm-error-code";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = password;

    try {
      await user.save();
    }
    catch (error) {
      if (error.code === TypeormErrorCode.DUPLICATED_USERNAME) {
        throw new ConflictException('Username already exists')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }
}