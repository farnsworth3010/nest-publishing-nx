import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OfficeService } from './office.service';
import { Roles } from '@app/gateway/decorators/roles.decorator';
import { UserRole } from '@app/contracts/user/user.interface';
import { AuthGuard } from '@app/gateway/guards/auth.guard';
import { RolesGuard } from '@app/gateway/guards/roles.guard';
import { CreateOfficeDto } from '@app/contracts/office/create-office.dto';
import { Observable } from 'rxjs';
import { Office } from '@app/contracts/office/office.entity';
import { UpdateOfficeDto } from '@app/contracts/office/update-office.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('office')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createOfficeDto: CreateOfficeDto): Observable<Office> {
    return this.officeService.create(createOfficeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(): Observable<Office[]> {
    return this.officeService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string): Observable<Office> {
    return this.officeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateOfficeDto: UpdateOfficeDto,
  ): Observable<UpdateResult> {
    return this.officeService.update(+id, updateOfficeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.officeService.remove(+id);
  }
}
