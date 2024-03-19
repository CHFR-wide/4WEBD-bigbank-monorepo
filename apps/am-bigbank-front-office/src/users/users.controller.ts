import { UsersTcpService } from '@ambigbank/services';
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TUserJwt, UserJwt } from 'src/decorators/req-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  /**
   *
   */
  constructor(private usersService: UsersTcpService) {}

  @Get('me')
  async findCurrentUser(@UserJwt() userJwt: TUserJwt) {
    const user = await this.usersService.findOne(userJwt.sub);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { password, ...safeUser } = await this.usersService.findOne(+id);

    return safeUser;
  }

  @Patch()
  async update(
    @UserJwt() user: TUserJwt,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { password, ...safeUser } = await this.usersService.update(
      user.sub,
      updateUserDto,
    );

    return safeUser;
  }

  @Delete()
  async remove(@UserJwt() userJwt: TUserJwt) {
    const { password, ...safeUser } = await this.usersService.remove(
      userJwt.sub,
    );

    return safeUser;
  }
}
