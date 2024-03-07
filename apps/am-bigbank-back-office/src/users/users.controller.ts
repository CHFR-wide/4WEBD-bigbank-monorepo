import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TUserJwt, UserJwt } from 'src/decorators/req-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  /**
   *
   */
  constructor(private usersService: UsersService) {}

  @Get('me')
  async findCurrentUser(@UserJwt() userJwt: TUserJwt) {
    const user = await this.usersService.findOne(userJwt.sub);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    return users.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(+id, updateUserDto);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @UserJwt() userJwt: TUserJwt) {
    const user = await this.usersService.remove(+id);

    const { password, ...safeUser } = user;
    return safeUser;
  }
}
