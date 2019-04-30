import { ApiGetRequest } from '@gfk/ngx-tools';
import { projectsListManager } from './projects-list.manager';

export class FetchProjectsList extends ApiGetRequest {
  constructor() {
    super('projects', projectsListManager.actions.fetch.base, projectsListManager.schema);
  }
}
