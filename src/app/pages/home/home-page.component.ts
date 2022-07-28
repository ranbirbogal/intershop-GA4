import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

declare let gtag: Function;
@Component({
  selector: 'ish-home-page',
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  constructor(private router: Router){}

  trackMe() {
    gtag('event', 'TRACK_ME_BUTTON_CLICKED', {
    'event_category': 'BUTTON_CLICK',
    'event_label': 'Track Me Click',
    'value': 'Put a value here that is meaningful with respect to the click event'   })
    this.router.navigate(['compare'])
  }
}
