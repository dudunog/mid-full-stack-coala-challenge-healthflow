import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(createUserDto: CreateUserDto) {
    const { email, name, password, role } = createUserDto;

    const existingUser = await this.userService.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await this.userService.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
