import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { ProductListService } from '../../services/products/products.service';
import { ProductListComponent } from './product-list.component';
import { mock, instance, when, anything, verify } from "ts-mockito/lib/ts-mockito";
import { ActivatedRoute } from '@angular/router';
import { ProductTileModel } from "../product-tile/product-tile.model";

describe('Product List Component', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;
  let element: HTMLElement;
  let productListService: ProductListService;
  const activatedRouteMock = {
    'url': Observable.of(
      [{ 'path': 'cameras', 'parameters': {} },
      { 'path': 'cameras', 'parameters': {} }
      ])
  }

  beforeEach(async(() => {
    productListService = mock(ProductListService);
    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ProductListService, useFactory: () => instance(productListService) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(productListService.getProductList(anything())).thenReturn(Observable.of([new ProductTileModel()]));
  });

  it('should call ngOnInit and confirm that getProductList is called once', () => {
    verify(productListService.getProductList(anything())).never();
    fixture.detectChanges();
    verify(productListService.getProductList(anything())).once();
  });

  it('should check if the data is being rendered on the page', () => {
    fixture.detectChanges();
    const thumbs = element.querySelectorAll('is-product-tile');
    expect(thumbs.length).toBe(1);
  });
});
