import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { Document } from './document.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserDataService } from '../shared/auth/user-data.service';
import * as logger from '../shared/logger';

@Controller('documents')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private userDataService: UserDataService,
  ) {}

  /* GET auf http://SERVER:PORT/documents/test */
  @Get('bla')
  test(): any {
    return 'OK';
  }

  /* GET auf http://SERVER:PORT/documents, also z.B.

  curl -X GET \
    http://SERVER:PORT/documents \
    -H 'Authorization: Bearer XXXXX' \
    -H 'Cache-Control: no-cache' \
    -H 'Postman-Token: a5533227-34ce-4b33-8282-1e2dff4aa95f'
  */

  /**
   * Liefert die Liste aller Dokumente (inkl. Links) für den User,
   * der die Anfrage stellt. Falls die Benutzerdaten fehlen oder unbekannt sind, dann 417
   * @param requestData Die Request-Daten - aus diesen wird wird der angemeldete Benutzer ermittelt
   * @returns die Liste der Dokumente des Benutzers (inkl der Links) wenn ei
   */
  @Get()
  @UseGuards(AuthGuard())
  async findAll(@Req() requestData): Promise<Document[]> {
    const userId = this.userDataService.getUserData(requestData);
    if (!userId) {
      throw new HttpException(
        'userId missing in DocumentController.findAll',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const result = await this.documentService.findAll(userId);
    return result;
  }

  // POST auf http://SERVER:PORT/documents, e.g.

  /*

    curl -X POST \
      http://SERVER:PORT/documents \
      -H 'Authorization: Bearer XXXXX' \
      -H 'Cache-Control: no-cache' \
      -H 'Content-Type: application/x-www-form-urlencoded' \
      -H 'Postman-Token: c4f718b6-1d30-4b3f-876b-a261f74b25fd' \
      -d 'projectId=3&kind=result&hash=12121212&description=testdaten&linkIds=%5B2%2C%204%5D'

      liefert in etwa:

      {
        "projectId": 3,
        "kind": "result",
        "hash": "12121212",
        "description": "testdaten",
        "address": null,
        "id": 4,
        "state": "PROGRESS",
        "stateDetails": "",
        "createdAt": "2018-09-16"
    }

  */

  /**
   * Anlegen eines neuen Dokuments (inkl. Links und Payment) für den angemeldeten Benutzer
   * @param documentDto Die Daten des zu erstellenden Dokuments
   * @param requestData Die Request-Daten - aus diesen wird wird der angemeldete Benutzer ermittelt
   */
  @Post()
  @UseGuards(AuthGuard())
  async createDocument(
    @Body() documentDto: DocumentDto,
    @Req() requestData,
  ): Promise<any> {
    logger.log('DocumentController.createDocument - documentDto', documentDto);

    // wir bekommen sowas (hoffentlich) in dem documentDto
    // {projectId: "3",
    // kind: "result",
    // hash: "212121",
    // description: "ttttt",
    // linkIds: [2, 4]}
    // payment: { }

    if (!this.documentService.hasValidPaymentData) {
      throw new HttpException(
        'payment receipt is missing',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const userId = this.userDataService.getUserData(requestData);

    const savedDocument = await this.documentService.createDocument(
      userId,
      documentDto,
    );

    logger.log(
      'DocumentController.createDocument - savedDocument',
      savedDocument,
    );

    return savedDocument;
  }
}
