import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { StoreComponent as BaseComponent } from '@gfk/ngx-tools';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';

export abstract class StoreComponent extends BaseComponent implements OnDestroy {
  constructor(protected store: Store<State>, protected cd: ChangeDetectorRef) {
    super(store, cd);
  }

  // because of https://github.com/angular/angular/issues/22825
  public ngOnDestroy() {
    super.ngOnDestroy();
  }
}
