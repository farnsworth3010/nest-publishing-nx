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
import { MaterialService } from './material.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '@app/gateway/decorators/roles.decorator';
import { UserRole } from '@app/contracts/user/user.interface';
import { AuthGuard } from '@app/gateway/guards/auth.guard';
import { RolesGuard } from '@app/gateway/guards/roles.guard';
import { Observable } from 'rxjs';
import { Material } from '@app/contracts/material/material.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateMaterialDto } from '@app/contracts/material/create-material.dto';
import { UpdateMaterialDto } from '@app/contracts/material/update-material.dto';

@ApiTags('material')
@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  create(@Body() createMaterialDto: CreateMaterialDto): Observable<Material> {
    return this.materialService.create(createMaterialDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  findAll(): Observable<Material[]> {
    return this.materialService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'integer', description: 'Material ID' })
  findOne(@Param('id') id: string): Observable<Material> {
    return this.materialService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'integer', description: 'Material ID' })
  update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ): Observable<UpdateResult> {
    return this.materialService.update(+id, updateMaterialDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'integer', description: 'Material ID' })
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.materialService.remove(+id);
  }
}
