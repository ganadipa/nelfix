import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserService } from './user.service';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @Roles(['ADMIN'])
  async getUsers(@Query('q') q: string, @Req() req: ExtendedRequest) {
    return {
      status: 'success',
      message: 'Users fetched successfully',
      data: await this.userService.getUsers(q),
    };
  }

  @Get(':id')
  @Roles(['ADMIN'])
  async getUser(@Param('id') id: string) {
    return {
      status: 'success',
      message: 'User fetched successfully',
      data: await this.userService.getUser(id),
    };
  }

  @Post(':id/balance')
  @Roles(['ADMIN'])
  async addBalance(@Param('id') id: string, @Body('increment') inc: number) {
    return {
      status: 'success',
      message: 'Balance updated successfully',
      data: await this.userService.addBalance(id, inc),
    };
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  async deleteUser(@Param('id') id: string) {
    return {
      status: 'success',
      message: 'User deleted successfully',
      data: await this.userService.deleteUser(id),
    };
  }
}
