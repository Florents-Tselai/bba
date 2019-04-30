import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ContainerComponent } from '../base/container-component.class';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'dcs-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent extends ContainerComponent implements OnInit, OnDestroy {
  @Input()
  public title = 'Modal title';

  @Input()
  public config: OverlayConfig;

  @ViewChild(TemplateRef)
  template: TemplateRef<any>;

  @Output()
  showTriggered = new EventEmitter<any>();
  @Output()
  hideTriggered = new EventEmitter<any>();

  protected defaultConfig: OverlayConfig;
  protected overlayRef: OverlayRef;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    super();

    const position = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const scroll = this.overlay.scrollStrategies.block();

    this.defaultConfig = new OverlayConfig({
      hasBackdrop: true,
      positionStrategy: position,
      scrollStrategy: scroll,
      minHeight: '50%',
      minWidth: '50%',
      maxHeight: '90%',
      maxWidth: '90%',
    });
  }

  ngOnInit() {
    this.overlayRef = this.overlay.create(this.buildConfig());

    this.subscribeToObservable(this.overlayRef.attachments(), () => {
      this.showTriggered.next();
    });

    this.subscribeToObservable(this.overlayRef.detachments(), () => {
      this.hideTriggered.next();
    });

    this.subscribeToObservable(this.overlayRef.backdropClick(), () => {
      this.hide();
    });
  }

  ngOnDestroy() {
    this.overlayRef.dispose();
  }

  public show(): void {
    if (this.template) {
      const portal = new TemplatePortal(this.template, this.viewContainerRef);
      this.overlayRef.attach(portal);
    }
  }

  public hide(): void {
    this.overlayRef.detach();
  }

  public toggle(): void {
    if (this.overlayRef.hasAttached()) {
      this.hide();
    } else {
      this.show();
    }
  }

  protected buildConfig(): OverlayConfig {
    return new OverlayConfig({ ...this.defaultConfig, ...this.config });
  }
}
