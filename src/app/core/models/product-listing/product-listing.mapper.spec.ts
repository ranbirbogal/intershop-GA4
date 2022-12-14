import { TestBed } from '@angular/core/testing';

import { ProductListingMapper } from './product-listing.mapper';

describe('Product Listing Mapper', () => {
  let productListingMapper: ProductListingMapper;

  beforeEach(() => {
    productListingMapper = TestBed.inject(ProductListingMapper);
  });

  it('should map single page data to one page', () => {
    expect(productListingMapper.createPages(['A', 'B'], 'test', 'dummy', 2)).toMatchInlineSnapshot(`
      Object {
        "1": Array [
          "A",
          "B",
        ],
        "id": Object {
          "type": "test",
          "value": "dummy",
        },
        "itemCount": 2,
        "sortableAttributes": Array [],
      }
    `);
  });

  it('should map multi page data to multiple pages', () => {
    expect(productListingMapper.createPages(['A', 'B', 'C', 'D', 'E'], 'test', 'dummy', 2)).toMatchInlineSnapshot(`
      Object {
        "1": Array [
          "A",
          "B",
        ],
        "2": Array [
          "C",
          "D",
        ],
        "3": Array [
          "E",
        ],
        "id": Object {
          "type": "test",
          "value": "dummy",
        },
        "itemCount": 5,
        "sortableAttributes": Array [],
      }
    `);
  });

  it('should map extra arguments when supplied', () => {
    expect(
      productListingMapper.createPages(['A', 'B', 'C', 'D'], 'test', 'dummy', 2, {
        sortableAttributes: [{ name: 'name-desc' }],
        itemCount: 200,
        sorting: 'name-asc',
        filters: { foo: ['bar'] },
        startPage: 4,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "4": Array [
          "A",
          "B",
        ],
        "5": Array [
          "C",
          "D",
        ],
        "id": Object {
          "filters": Object {
            "foo": Array [
              "bar",
            ],
          },
          "sorting": "name-asc",
          "type": "test",
          "value": "dummy",
        },
        "itemCount": 200,
        "sortableAttributes": Array [
          Object {
            "name": "name-desc",
          },
        ],
      }
    `);
  });
});
