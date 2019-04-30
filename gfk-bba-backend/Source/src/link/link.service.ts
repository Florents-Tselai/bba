import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';
import * as logger from '../shared/logger';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
  ) {}

  /**
   * Liefert eine Liste von Links zurück - ungefiltert
   * @returns ein Promise auf: Ein Mapping von sourceId auf ein Array von targetIds
   */
  async findAll() {
    // TODO bei großen Datenmengen hat der Ansatz Luft nach oben
    // man könnte z.B. nach Dokumenten filtern, die dem Anwender gehören

    const linkList = await this.linkRepository.find({});

    const linksPerDocument = {};

    linkList.forEach((link: Link) => {
      const sourceId = link.sourceDocumentId;
      const targetId = link.targetDocumentId;
      const targetIds = linksPerDocument[sourceId] || [];
      targetIds.push(targetId);
      linksPerDocument[sourceId] = targetIds;
    });

    // logger.log('LinkService.findAll - result', linksPerDocument);

    return linksPerDocument;
  }

  /**
   * Liefert eine Liste der Links zurück, die das angegebene Dokument als Ausgangspukt (source) haben
   * @param sourceDocumentId die ID des Dokuments, für das wir alles Links suchen
   * @returns ein Promise auf eine Liste von Links
   */
  async findAllLinksForDocument(sourceDocumentId: number) {
    logger.log(
      'LinkService.findAllLinksForDocument - sourceDocumentId',
      sourceDocumentId,
    );

    const result = await this.linkRepository.find({ sourceDocumentId });

    logger.log('LinkService.findAllLinksForDocument - result', result);

    return result;
  }

  /**
   * Erstellt eine einzelne Verkünpfung zwischen zwei Dokumenten definiert durch die IDs (sourceId und targetId)
   * @param sourceId die ID der Verknüpfungs-Starts
   * @param targetId die ID der Verknüpfungs-Ziels
   * @returns Ein Promise auf eine einzelne Verknüpfung (link)
   */
  async create(sourceId: number, targetId: number): Promise<Link> {
    const link = new Link(sourceId, targetId);
    return await this.linkRepository.save(link);
  }
}
