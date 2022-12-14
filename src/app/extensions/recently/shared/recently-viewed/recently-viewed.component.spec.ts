import { Location } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipe } from '@ngx-translate/core';
import { MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';

import { RecentlyFacade } from '../../facades/recently.facade';

import { RecentlyViewedComponent } from './recently-viewed.component';

describe('Recently Viewed Component', () => {
  let fixture: ComponentFixture<RecentlyViewedComponent>;
  let component: RecentlyViewedComponent;
  let element: HTMLElement;
  let recentlyFacade: RecentlyFacade;
  let location: Location;

  beforeEach(async () => {
    recentlyFacade = mock(RecentlyFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'recently', component: RecentlyViewedComponent }])],
      declarations: [MockDirective(ProductContextDirective), MockPipe(TranslatePipe), RecentlyViewedComponent],
      providers: [{ provide: RecentlyFacade, useFactory: () => instance(recentlyFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when no tiles are present', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  describe('with items', () => {
    beforeEach(() => {
      when(recentlyFacade.mostRecentlyViewedProducts$).thenReturn(of(['P1', 'P2', 'P3']));

      fixture.detectChanges();
    });

    it('should display product-item components for all products', () => {
      expect(element.querySelectorAll('ish-product-item')).toHaveLength(3);
    });

    it('should display view all link on page', () => {
      expect(findAllDataTestingIDs(fixture)).toContain('view-all');
    });

    it('should properly propagate inputs to product-tiles', () => {
      expect(fixture.debugElement.queryAll(By.css('[ishProductContext]')).map(de => de.attributes['ng-reflect-sku']))
        .toMatchInlineSnapshot(`
        Array [
          "P1",
          "P2",
          "P3",
        ]
      `);
    });
  });

  describe('link to recently page', () => {
    it('should navigate to recently page when view-all link is clicked', fakeAsync(() => {
      when(recentlyFacade.mostRecentlyViewedProducts$).thenReturn(of(['P1']));

      fixture.detectChanges();

      expect(location.path()).toMatchInlineSnapshot(`""`);

      const link = element.querySelector('[data-testing-id="view-all"]') as HTMLLinkElement;

      link.click();

      tick(0);

      expect(location.path()).toMatchInlineSnapshot(`"/recently"`);
    }));
  });
});
