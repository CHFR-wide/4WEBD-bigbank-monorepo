import { UsersTcpService } from '@ambigbank/services';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { TUserJwt } from 'src/decorators/req-user.decorator';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    private usersService: UsersTcpService,
    private jwtService: JwtService,
  ) {}

  constructUserToken(user: any) {
    const payload: TUserJwt = {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password } = signInDto;

    const user = await this.usersService
      .findOneByEmail(email)
      .catch(() => null);
    const isMatch = bcrypt.compareSync(password, user?.password || '');

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return this.constructUserToken(user);
  }

  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
    const saltOrRounds = 10;
    const hash = bcrypt.hashSync(signUpDto.password, saltOrRounds);

    const user = await this.usersService.create({
      ...signUpDto,
      password: hash,
    });

    return this.constructUserToken(user);
  }
}
