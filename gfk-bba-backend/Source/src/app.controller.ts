import { Get, Controller, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { DocumentService } from './document/document.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly documentService: DocumentService,
  ) {}

  // TODO Testaufruf entfernen
  @Get('test')
  async test(): Promise<any[]> {
    const result = await this.documentService.findAllLinkedDocs(15);
    return result;
  }
}
