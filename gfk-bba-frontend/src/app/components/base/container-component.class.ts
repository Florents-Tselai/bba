import { OnDestroy } from '@angular/core';
import { ContainerComponent as BaseComponent } from '@gfk/ngx-tools';
import { Subject } from 'rxjs';

export abstract class ContainerComponent extends BaseComponent implements OnDestroy {
  protected onDestroy$ = new Subject();

  public ngOnDestroy(): void {
    // because of https://github.com/angular/angular/issues/22825
    super.ngOnDestroy();
  }
}
