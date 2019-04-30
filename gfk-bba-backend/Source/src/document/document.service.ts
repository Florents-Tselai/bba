import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Document } from './document.entity';
import { LinkService } from '../link/link.service';
import { PaymentService } from '../payment/payment.service';

import * as logger from '../shared/logger';
import { ContractService } from '../contract/contract.service';
import { ProjectService } from '../project/project.service';
import { Link } from '../link/link.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private projectService: ProjectService,
    private linkService: LinkService,
    private paymentService: PaymentService,
    private contractService: ContractService,
  ) {}

  /**
   * Ermittlet die Liste aller Dokumente (documents) mit den Links für den angegebenen Benutzer (userId) oder 417 falls die userId fehlt
   * @param userId die userId für die wir die Dokumente haben wollen
   * @returns die Liste aller Dokumente (documents) mit den Links für den angegebenen Benutzer (userId)
   */
  async findAll(userId: number): Promise<any[]> {
    if (!userId) {
      throw new HttpException(
        'userId missing in DocumentService.findAll',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const result = await this.findAllForUserId(userId);
    const linksGroupedBySource = await this.linkService.findAll();

    const resultList = result.map((doc: any) =>
      this.addLinks(doc, linksGroupedBySource),
    );

    return resultList;
  }

  async findAllForDocIds(
    listOfDocIds: Array<number>,
  ): Promise<Array<Document>> {
    if (!listOfDocIds || !listOfDocIds.length) {
      return [];
    }

    const result = await this.documentRepository.manager
      .createQueryBuilder(Document, 'document')
      .where('document.id IN (:...listOfDocIds)', {
        listOfDocIds,
      })
      .printSql()
      .getMany();

    return result;
  }

  async findAllLinkedDocs(sourceDocumentId: number): Promise<Array<Document>> {
    logger.log('findAllLinkedDocs - sourceDocumentId', sourceDocumentId);

    // Liste aller Links von dem Quell-Dokument
    const allLinks =
      (await this.linkService.findAllLinksForDocument(sourceDocumentId)) || [];

    // .. davon nur die IDs der Ziel-Dokumente
    const allTargetDocIds = allLinks.map((link: Link) => link.targetDocumentId);

    // .. und davon dann die Dokumente selbst
    const result = await this.findAllForDocIds(allTargetDocIds);

    logger.log('findAllLinkedDocs - result', result);

    return result;
  }

  private addLinks(doc: Document, linksGroupedBySource: any) {
    const result: any = doc;
    result.linkIds = linksGroupedBySource[result.id] || [];
    return result;
  }

  /**
   * Ermittelt die Liste aller Dokumente (documents) ohne die Links für den angegebenen Benutzer (userId)
   * @param userId The userId for which we want the list of documents
   * @returns die Liste aller Dokumente (documents) ohne die Links für den angegebenen Benutzer (userId)
   */
  private async findAllForUserId(userId: number) {
    logger.log(`DocumentService.findAllForUserId(${userId})`);

    const projects = await this.projectService.findAll(userId);

    if (projects && projects.length) {
      const projectIds = projects.map(p => p.id);

      const result = await this.documentRepository.manager
        .createQueryBuilder(Document, 'document')
        .where('document.project_id IN (:...projects)', {
          projects: projectIds,
        })
        .printSql()
        .getMany();

      // logger.log(result);
      return result;
    }

    return [];
  }

  /**
   * Erstellt ein Dokument (documents) für den angegebenen Benutzer (userId)
   * @param userId Der Benutzer, der das Dokument angelegt werden soll
   * @param documentDto Die Daten des anzulegenden Dokuments
   */
  async createDocument(
    userId: number,
    documentDto: DocumentDto,
  ): Promise<Document> {
    // wir bekommen sowas (hoffentlich) als documentDto
    // {projectId: "3",
    // kind: "result",
    // hash: "212121",
    // description: "ttttt",
    // linkIds: [2, 4]}

    logger.log(`DocumentService.createDocument(${userId}, ${documentDto})`);

    if (!userId) {
      throw new HttpException(
        'userId missing in DocumentService.createDocument',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    // TODO wir brauchen hier vermutlich noch einen Check, ob das Projekt dem Benutzer gehört

    const doc = new Document();
    doc.projectId = parseInt(documentDto.projectId, 10);
    doc.kind = documentDto.kind;
    doc.hash = documentDto.hash;
    doc.description = documentDto.description;
    doc.createdAt = new Date();

    logger.log('DocumentService.createDocument - doc', doc);

    let savedDocument = await this.documentRepository.save(doc);

    logger.log('DocumentService.createDocument - savedDocument', savedDocument);

    const result = await this.findById(savedDocument.id);
    logger.log('DocumentService.createDocument - result', result);

    await this.storeLinksToDoc(savedDocument.id, documentDto);
    await this.processPaymentData(savedDocument.id, documentDto.payment || {});

    const linksIds = documentDto.linkIds || [];

    // mit Absicht kein Await
    // this.addToBlockchain(savedDocument, documentDto).then(address => {
    //   this.documentRepository.update(savedDocument.id, {
    //     address,
    //     state: 'OK',
    //     stateDetails:
    //       'Successfully saved in the ethereum blockchain at ' + new Date(),
    //   });
    // });

    logger.log(`DocumentService.createDocument - vor addToBlockchain`);

    const address = await this.addToBlockchain(savedDocument, documentDto);

    logger.log(
      `DocumentService.createDocument - nach addToBlockchain -  address = `,
      address,
    );

    savedDocument.address = address;
    savedDocument.state = 'OK';
    savedDocument.stateDetails =
      'Successfully saved in the ethereum blockchain at ' + new Date();

    const rrrr = await this.documentRepository.save(savedDocument);

    logger.log(
      `DocumentService.createDocument - nach addToBlockchain -  rrrr = `,
      rrrr,
    );
    // await photoRepository.save(photoToUpdate);

    return savedDocument;
  }
  private async addToBlockchain(
    savedDocument: Document,
    documentDto: DocumentDto,
  ): Promise<string> {
    const addressesOfLinkedDocs = await this.getAdressesOfLinksToDoc(
      documentDto,
    );

    return await this.contractService.createContract(
      savedDocument.hash,
      addressesOfLinkedDocs,
    );
  }

  private async storeLinksToDoc(documentId: number, documentDto: DocumentDto) {
    logger.log(
      'DocumentService.addLinks -  documentDto.linkIds',
      documentDto.linkIds,
    );

    const linkIds = this.getIdsOfLinkedDocuments(documentDto);

    linkIds.forEach(async targetId => {
      logger.log('DocumentService.addLinks - targetId', targetId);
      await this.linkService.create(documentId, targetId);
    });
  }

  private getIdsOfLinkedDocuments(documentDto: DocumentDto): Array<number> {
    let linkIds = [];

    if (
      documentDto &&
      documentDto.linkIds &&
      Array.isArray(documentDto.linkIds)
    ) {
      linkIds = documentDto.linkIds;
    }

    logger.log('DocumentService.getIdsOfLinkedDocuments - linkIds', linkIds);

    return linkIds;
  }

  private async getAdressesOfLinksToDoc(
    documentDto: DocumentDto,
  ): Promise<Array<string>> {
    const linkIds = this.getIdsOfLinkedDocuments(documentDto);
    const linkedDocs = await this.findAllForDocIds(linkIds);
    const result = linkedDocs.map(document => document.address || '');

    logger.log('DocumentService.getAdressesOfLinksToDoc - result', result);

    return result;
  }

  private async processPaymentData(documentId: number, paymentData: any) {
    logger.log('DocumentService.processPaymentData - started', {
      documentId,
      paymentData,
    });

    if (!paymentData.coupon && !paymentData.paypal) {
      logger.log(
        'DocumentService.processPaymentData - ERROR no valid payment method found',
        {
          documentId,
          paymentData,
        },
      );
      return false;
    }

    if (paymentData.coupon && paymentData.paypal) {
      logger.log(
        'DocumentService.processPaymentData - ERROR only one payment method may be provided',
        { documentId, paymentData },
      );
      return false;
    }

    logger.log(`DocumentService.processPaymentData - paymentData`, paymentData);

    let payment;

    if (paymentData.coupon) {
      payment = await this.paymentService.storeCouponPayment(
        documentId,
        paymentData.coupon,
      );
    } else {
      payment = await this.paymentService.storePayPalPayment(
        documentId,
        paymentData.paypal,
      );
    }

    logger.log('DocumentService.processPaymentData - payment record', payment);

    return true;
  }

  hasValidPaymentData(documentDto: DocumentDto): boolean {
    const paymentData = documentDto.payment;

    if (!paymentData) {
      logger.log(
        'DocumentService.hasValidPaymentData - ERROR no payment data found',
        {
          documentDto,
        },
      );
      return false;
    }

    let result = true;

    if (!paymentData.coupon && !paymentData.paypal) {
      logger.log(
        'DocumentService.hasValidPaymentData - ERROR no valid payment method found',
        {
          paymentData,
        },
      );
      result = false;
    }

    if (paymentData.coupon && paymentData.paypal) {
      logger.log(
        'DocumentService.hasValidPaymentData - ERROR only one payment method may be provided',
        { paymentData },
      );
      result = false;
    }

    return result;
  }

  async findById(id: number): Promise<any> {
    const linksGroupedBySource = await this.linkService.findAll();
    const doc = await this.documentRepository.findOne({ id });
    const result = this.addLinks(doc, linksGroupedBySource);
    return result;
  }
}
