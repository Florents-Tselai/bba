import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  /**
   * Holt alles Projekte eines Benutzers
   * @param userId die ID des Users für den wir die Projektliste erstellen wollen
   * @returns ein Promise die Liste der Projekte des Benutzers
   */
  async findAll(userId: number): Promise<Project[]> {
    if (!userId) {
      throw new HttpException(
        'userId missing in ProjectService.findAll',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return await this.projectRepository.find({ userId });
  }

  /**
   * Erstellt einen Projektdatensatz in der DB
   * @param userId die ID des Users für den wir den wir das Projekt erstellen wollen
   * @param projectDto die Projektdaten (Name, Beschreibung) als DTO vom Frontene
   * @returns ein Promise des Datensatzes aus der DB (inkl. ID)
   */
  async create(userId: number, projectDto: ProjectDto): Promise<Project> {
    if (!userId) {
      throw new HttpException(
        'userId missing in ProjectService.create',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const newProject = { ...projectDto, userId, id: null, documents: [] };
    return this.projectRepository.save(newProject);
  }
}

