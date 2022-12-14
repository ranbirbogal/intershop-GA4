import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, NavigationEnd, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { filter, first } from 'rxjs/operators';

import { CookiesModalComponent } from './cookies-modal/cookies-modal.component';

@Injectable()
export class CookiesPageGuard implements CanActivate {
  private currentDialog: NgbModalRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private modalService: NgbModal,
    private router: Router
  ) {}

  async canActivate() {
    if (isPlatformServer(this.platformId)) {
      return this.router.parseUrl('/loading');
    }

    this.currentDialog = this.modalService.open(CookiesModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
    });

    const cookiesModalComponent = this.currentDialog.componentInstance as CookiesModalComponent;

    // dialog closed
    cookiesModalComponent.closeModal.pipe(first()).subscribe(() => {
      this.currentDialog.dismiss();
    });

    // navigated away with link on dialog
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        first()
      )
      .subscribe(() => {
        this.currentDialog.dismiss();
      });

    return false;
  }
}
