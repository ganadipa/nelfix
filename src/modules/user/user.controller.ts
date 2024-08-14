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
  getUsers(@Query('q') q: string, @Req() req: ExtendedRequest) {
    console.log(req.user);

    return this.userService.getUsers(q);
  }

  @Get(':id')
  @Roles(['ADMIN'])
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Post(':id/balance')
  @Roles(['ADMIN'])
  addBalance(@Param('id') id: string, @Body('increment') inc: number) {
    return this.userService.addBalance(id, inc);
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
