import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { UserDataService } from '../shared/auth/user-data.service';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userDataService: UserDataService,
  ) {}

  /**
   * Liefert eine Liste der Projekte des übergebenen Benutzers (userId) oder 417, falls die Benuterangabe (userId) fehlt
   * @param requestData Die Request-Daten - aus diesen wird wird der angemeldete Benutzer ermittelt
   */
  @Get()
  @UseGuards(AuthGuard())
  async findAll(@Req() requestData): Promise<Project[]> {
    const userId = this.userDataService.getUserData(requestData);
    if (!userId) {
      throw new HttpException(
        'userId missing in ProjectController.findAll',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return await this.projectService.findAll(userId);
  }

  /**
   * Neuanlegen eines Projekts
   * @param projectDto Die Projektdaten (Name und Beschreibung als DTO)
   * @param requestData Die Request-Daten - aus diesen wird wird der angemeldete Benutzer ermittelt
   * @return das in der Datenbank erstellte Projekt
   */
  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() projectDto: ProjectDto,
    @Req() requestData,
  ): Promise<Project> {
    const userId = this.userDataService.getUserData(requestData);
    return await this.projectService.create(userId, projectDto);
  }
}
