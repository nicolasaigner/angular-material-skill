<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# Paginator

> Fonte: [documentação oficial](https://material.angular.dev/components/paginator/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

`<mat-paginator>` provides navigation for paged information, typically used with a table.

#### Exemplo: `paginator-overview`

```ts
import {Component} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';

/**
 * @title Paginator
 */
@Component({
  selector: 'paginator-overview-example',
  templateUrl: 'paginator-overview-example.html',
  imports: [MatPaginatorModule],
})
export class PaginatorOverviewExample {}
```

```html
<mat-paginator [length]="100"
              [pageSize]="10"
              [pageSizeOptions]="[5, 10, 25, 100]"
              aria-label="Select page">
</mat-paginator>
```

### Basic use
Each paginator instance requires:
* The number of items per page (default set to 50)
* The total number of items being paged

The current page index defaults to 0, but can be explicitly set via pageIndex.

When the user interacts with the paginator, a `PageEvent` will be fired that can be used to update
any associated data view.

### Page size options
The paginator displays a dropdown of page sizes for the user to choose from. The options for this
dropdown can be set via `pageSizeOptions`

The current pageSize will always appear in the dropdown, even if it is not included in
pageSizeOptions.

If you want to customize some of the optional of the `mat-select` inside the `mat-paginator`, you
can use the `selectConfig` input.

### Internationalization
The labels for the paginator can be customized by providing your own instance of `MatPaginatorIntl`.
This will allow you to change the following:
 1. The label for the length of each page.
 2. The range text displayed to the user.
 3. The tooltip messages on the navigation buttons.

### Accessibility
The paginator uses `role="group"` to semantically group its child controls. You must add an
`aria-label` or `aria-labelledby` attribute to `<mat-paginator>` with a label that describes
the content controlled by the pagination control.

You can set the `aria-label` attributes for the button and select controls within the paginator in
`MatPaginatorIntl`.
