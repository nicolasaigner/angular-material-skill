<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# Table

> Fonte: [documentação oficial](https://material.angular.dev/components/table/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

The `mat-table` provides a Material Design styled data-table that can be used to display rows of
data.

This table builds on the foundation of the CDK data-table and uses a similar interface for its
data input and template, except that its element and attribute selectors will be prefixed
with `mat-` instead of `cdk-`. For more information on the interface and a detailed look at how
the table is implemented, see the
[guide covering the CDK data-table](https://material.angular.dev/guide/cdk-table).

### Getting Started

#### Exemplo: `table-basic`

```ts
import {Component} from '@angular/core';
import {MatTableModule} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'table-basic-example',
  styleUrl: 'table-basic-example.css',
  templateUrl: 'table-basic-example.html',
  imports: [MatTableModule],
})
export class TableBasicExample {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}
```

```html
<table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

  <!--- Note that these columns can be defined in any order.
        The actual rendered columns are set as a property on the row definition" -->

  <!-- Position Column -->
  <ng-container matColumnDef="position">
    <th mat-header-cell *matHeaderCellDef> No. </th>
    <td mat-cell *matCellDef="let element"> {{element.position}} </td>
  </ng-container>

  <!-- Name Column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef> Name </th>
    <td mat-cell *matCellDef="let element"> {{element.name}} </td>
  </ng-container>

  <!-- Weight Column -->
  <ng-container matColumnDef="weight">
    <th mat-header-cell *matHeaderCellDef> Weight </th>
    <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
  </ng-container>

  <!-- Symbol Column -->
  <ng-container matColumnDef="symbol">
    <th mat-header-cell *matHeaderCellDef> Symbol </th>
    <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

```css
table {
  width: 100%;
}
```

#### 1. Write your mat-table and provide data

Begin by adding the `<table mat-table>` component to your template and passing in data.

The simplest way to provide data to the table is by passing a data array to the table's `dataSource`
input. The table will take the array and render a row for each object in the data array.

```html
<table mat-table [dataSource]="myDataArray">
  ...
</table>
```

Since the table optimizes for performance, it will not automatically check for changes to the data
array. Instead, when objects are added, removed, or moved on the data array, you can trigger an
update to the table's rendered rows by calling its `renderRows()` method.

While an array is the _simplest_ way to bind data into the data source, it is also
the most limited. For more complex applications, using a `DataSource` instance
is recommended. See the section "Advanced data sources" below for more information.

#### 2. Define the column templates

Next, write your table's column templates.

Each column definition should be given a unique name and contain the content for its header and row
cells.

Here's a simple column definition with the name `'score'`. The header cell contains the text
"Score" and each row cell will render the `score` property of each row's data.

```html
<ng-container matColumnDef="score">
  <th mat-header-cell *matHeaderCellDef> Score </th>
  <td mat-cell *matCellDef="let user"> {{user.score}} </td>
</ng-container>
```

Note that the cell templates are not restricted to only showing simple string values, but are
flexible and allow you to provide any template.

If your column is only responsible for rendering a single string value for the header and cells,
you can instead define your column using the `mat-text-column`. The following column definition is
equivalent to the one above.

```html
<mat-text-column name="score"></mat-text-column>
```

Check out the API docs and examples of the `mat-text-column` to see how you can customize the header
text, text alignment, and cell data accessor.  Note that this is not compatible with the flex-layout
table. Also, a data accessor should be provided if your data may have its properties minified
since the string name will no longer match after minification.

#### 3. Define the row templates

Finally, once you have defined your columns, you need to tell the table which columns will be
rendered in the header and data rows.

To start, create a variable in your component that contains the list of the columns you want to
render.

```ts
columnsToDisplay = ['userName', 'age'];
```

Then add `mat-header-row` and `mat-row` to the content of your `mat-table` and provide your
column list as inputs.

```html
<tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
<tr mat-row *matRowDef="let myRowData; columns: columnsToDisplay"></tr>
```

Note that this list of columns provided to the rows can be in any order, not necessarily the order in
which you wrote the column definitions. Also, you do not necessarily have to include every column
that was defined in your template.

This means that by changing your column list provided to the rows, you can easily re-order and
include/exclude columns dynamically.

### Advanced data sources

The simplest way to provide data to your table is by passing a data array. More complex use-cases
may benefit from a more flexible approach involving an Observable stream or by encapsulating your
data source logic into a `DataSource` class.

#### Observable stream of data arrays

An alternative approach to providing data to the table is by passing an Observable stream that emits
the data array to be rendered each time it is changed. The table will listen to this stream and
automatically trigger an update to the rows each time a new data array is emitted.

#### DataSource

For most real-world applications, providing the table a `DataSource` instance will be the best way to
manage data. The `DataSource` is meant to serve as a place to encapsulate any sorting, filtering,
pagination, and data retrieval logic specific to the application.

A `DataSource` is simply a class that has at a minimum the following methods: `connect` and
`disconnect`. The `connect` method will be called by the table to provide an `Observable` that emits
the data array that should be rendered. The table will call `disconnect` when the table is destroyed,
which may be the right time to clean up any subscriptions that may have been registered in the
`connect` method.

Although Angular Material provides a ready-made table `DataSource` class, `MatTableDataSource`, you may
want to create your own custom `DataSource` class for more complex use cases. This can be done by
extending the abstract `DataSource` class with a custom `DataSource` class that then implements the
`connect` and `disconnect` methods. For use cases where the custom `DataSource` must also inherit
functionality by extending a different base class, the `DataSource` base class can be
implemented instead (`MyCustomDataSource extends SomeOtherBaseClass implements DataSource`) to
respect Typescript's restriction to only implement one base class.

### Styling Columns

Each table cell has an automatically generated class based on which column it appears in. The format for this
generated class is `mat-column-NAME`. For example, cells in a column named "symbol" can be targeted with the
selector `.mat-column-symbol`.

#### Exemplo: `table-column-styling`

```ts
import {Component} from '@angular/core';
import {MatTableModule} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

/**
 * @title Styling columns using their auto-generated column names
 */
@Component({
  selector: 'table-column-styling-example',
  styleUrl: 'table-column-styling-example.css',
  templateUrl: 'table-column-styling-example.html',
  imports: [MatTableModule],
})
export class TableColumnStylingExample {
  displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', 'demo-symbol'];
  dataSource = ELEMENT_DATA;
}
```

```html
<table mat-table [dataSource]="dataSource" class="mat-elevation-z8 demo-table">
  <!-- Position Column -->
  <ng-container matColumnDef="demo-position">
    <th mat-header-cell *matHeaderCellDef> No. </th>
    <td mat-cell *matCellDef="let element"> {{element.position}} </td>
  </ng-container>

  <!-- Name Column -->
  <ng-container matColumnDef="demo-name">
    <th mat-header-cell *matHeaderCellDef> Name </th>
    <td mat-cell *matCellDef="let element"> {{element.name}} </td>
  </ng-container>

  <!-- Weight Column -->
  <ng-container matColumnDef="demo-weight">
    <th mat-header-cell *matHeaderCellDef> Weight </th>
    <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
  </ng-container>

  <!-- Symbol Column -->
  <ng-container matColumnDef="demo-symbol">
    <th mat-header-cell *matHeaderCellDef> Symbol </th>
    <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

```css
.demo-table {
  width: 100%;
}

.mat-column-demo-position {
  width: 32px;
  border-right: 1px solid currentColor;
  padding-right: 24px;
  text-align: center;
}

.mat-column-demo-name {
  padding-left: 16px;
  font-size: 20px;
}

.mat-column-demo-weight {
  font-style: italic;
}

.mat-column-demo-symbol {
  width: 32px;
  text-align: center;
  font-weight: bold;
}
```

### Row Templates

Event handlers and property binding on the row templates will be applied to each row rendered by the table. For example,
adding a `(click)` handler to the row template will cause each individual row to call the handler when clicked.

#### Exemplo: `table-row-binding`

```ts
import {Component} from '@angular/core';
import {MatTableModule} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

/**
 * @title Binding event handlers and properties to the table rows.
 */
@Component({
  selector: 'table-row-binding-example',
  styleUrl: 'table-row-binding-example.css',
  templateUrl: 'table-row-binding-example.html',
  imports: [MatTableModule],
})
export class TableRowBindingExample {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();
}
```

```html
<table mat-table [dataSource]="dataSource" class="mat-elevation-z8 demo-table">
  <!-- Position Column -->
  <ng-container matColumnDef="position">
    <th mat-header-cell *matHeaderCellDef>No.</th>
    <td mat-cell *matCellDef="let element">{{element.position}}</td>
  </ng-container>

  <!-- Name Column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>Name</th>
    <td mat-cell *matCellDef="let element">{{element.name}}</td>
  </ng-container>

  <!-- Weight Column -->
  <ng-container matColumnDef="weight">
    <th mat-header-cell *matHeaderCellDef>Weight</th>
    <td mat-cell *matCellDef="let element">{{element.weight}}</td>
  </ng-container>

  <!-- Symbol Column -->
  <ng-container matColumnDef="symbol">
    <th mat-header-cell *matHeaderCellDef>Symbol</th>
    <td mat-cell *matCellDef="let element">{{element.symbol}}</td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr
      mat-row
      (click)="clickedRows.add(row)"
      [class.demo-row-is-clicked]="clickedRows.has(row)"
      *matRowDef="let row; columns: displayedColumns;"
  ></tr>
</table>

<div>
  <h3>
    Click Log
  </h3>
</div>

@if (!clickedRows.size) {
  <div>Clicked rows will be logged here</div>
}

<ul>
  @for (clickedRow of clickedRows; track clickedRow) {
    <li>Clicked on {{clickedRow.name}}</li>
  }
</ul>
```

```css
.demo-table {
  width: 100%;
}

.mat-mdc-row .mat-mdc-cell {
  border-bottom: 1px solid transparent;
  border-top: 1px solid transparent;
  cursor: pointer;
}

.mat-mdc-row:hover .mat-mdc-cell {
  border-color: currentColor;
}

.demo-row-is-clicked {
  font-weight: bold;
}
```

### Features

The `MatTable` is focused on a single responsibility: efficiently render rows of data in a
performant and accessible way.

You'll notice that the table itself doesn't come out of the box with a lot of features, but expects
that the table will be included in a composition of components that fills out its features.

For example, you can add sorting and pagination to the table by using MatSort and MatPaginator and
mutating the data provided to the table according to their outputs.

To simplify the use case of having a table that can sort, paginate, and filter an array of data,
the Angular Material library comes with a `MatTableDataSource` that has already implemented
the logic of determining what rows should be rendered according to the current table state. To add
these feature to the table, check out their respective sections below.

#### Pagination

To paginate the table's data, add a `<mat-paginator>` after the table.

If you are using the `MatTableDataSource` for your table's data source, simply provide the
`MatPaginator` to your data source. It will automatically listen for page changes made by the user
and send the right paged data to the table.

Otherwise if you are implementing the logic to paginate your data, you will want to listen to the
paginator's `(page)` output and pass the right slice of data to your table.

For more information on using and configuring the `<mat-paginator>`, check out the
[mat-paginator docs](https://material.angular.dev/components/paginator/overview).

The `MatPaginator` is one provided solution to paginating your table's data, but it is not the only
option. In fact, the table can work with any custom pagination UI or strategy since the `MatTable`
and its interface is not tied to any one specific implementation.

#### Exemplo: `table-pagination`

```ts
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'table-pagination-example',
  styleUrl: 'table-pagination-example.css',
  templateUrl: 'table-pagination-example.html',
  imports: [MatTableModule, MatPaginatorModule],
})
export class TablePaginationExample implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];
```

```html
<div class="mat-elevation-z8">
  <table mat-table [dataSource]="dataSource">

    <!-- Position Column -->
    <ng-container matColumnDef="position">
      <th mat-header-cell *matHeaderCellDef> No. </th>
      <td mat-cell *matCellDef="let element"> {{element.position}} </td>
    </ng-container>

    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef> Name </th>
      <td mat-cell *matCellDef="let element"> {{element.name}} </td>
    </ng-container>

    <!-- Weight Column -->
    <ng-container matColumnDef="weight">
      <th mat-header-cell *matHeaderCellDef> Weight </th>
      <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
    </ng-container>

    <!-- Symbol Column -->
    <ng-container matColumnDef="symbol">
      <th mat-header-cell *matHeaderCellDef> Symbol </th>
      <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [pageSizeOptions]="[5, 10, 20]"
                 showFirstLastButtons
                 aria-label="Select page of periodic elements">
  </mat-paginator>
</div>
```

```css
table {
  width: 100%;
}
```

#### Sorting

To add sorting behavior to the table, add the `matSort` directive to the table and add
`mat-sort-header` to each column header cell that should trigger sorting. Note that you have to import `MatSortModule` in order to initialize the `matSort` directive (see [API docs](https://material.angular.dev/components/sort/api)).

```html
<!-- Name Column -->
<ng-container matColumnDef="position">
  <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
  <td mat-cell *matCellDef="let element"> {{element.position}} </td>
</ng-container>
```

If you are using the `MatTableDataSource` for your table's data source, provide the `MatSort`
directive to the data source and it will automatically listen for sorting changes and change the
order of data rendered by the table.

By default, the `MatTableDataSource` sorts with the assumption that the sorted column's name
matches the data property name that the column displays. For example, the following column
definition is named `position`, which matches the name of the property displayed in the row cell.

Note that if the data properties do not match the column names, or if a more complex data property
accessor is required, then a custom `sortingDataAccessor` function can be set to override the
default data accessor on the `MatTableDataSource`.

When updating the data soure asynchronously avoid doing so by recreating the entire `MatTableDataSource` as this could break sorting. Rather update it through the `MatTableDataSource.data` property.

If you are not using the `MatTableDataSource`, but instead implementing custom logic to sort your
data, listen to the sort's `(matSortChange)` event and re-order your data according to the sort state.
If you are providing a data array directly to the table, don't forget to call `renderRows()` on the
table, since it will not automatically check the array for changes.

#### Exemplo: `table-sorting`

```ts
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild, inject} from '@angular/core';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
/**
 * @title Table with sorting
 */
@Component({
  selector: 'table-sorting-example',
  styleUrl: 'table-sorting-example.css',
  templateUrl: 'table-sorting-example.html',
  imports: [MatTableModule, MatSortModule],
})
export class TableSortingExample implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
```

```html
<table mat-table [dataSource]="dataSource" matSort (matSortChange)="announceSortChange($event)"
       class="mat-elevation-z8">

  <!-- Position Column -->
  <ng-container matColumnDef="position">
    <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by number">
      No.
    </th>
    <td mat-cell *matCellDef="let element"> {{element.position}} </td>
  </ng-container>

  <!-- Name Column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by name">
      Name
    </th>
    <td mat-cell *matCellDef="let element"> {{element.name}} </td>
  </ng-container>

  <!-- Weight Column -->
  <ng-container matColumnDef="weight">
    <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by weight">
      Weight
    </th>
    <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
  </ng-container>

  <!-- Symbol Column -->
  <ng-container matColumnDef="symbol">
    <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by symbol">
      Symbol
    </th>
    <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

```css
table {
  width: 100%;
}

th.mat-sort-header-sorted {
  color: black;
}
```

For more information on using and configuring the sorting behavior, check out the
[matSort docs](https://material.angular.dev/components/sort/overview).

The `MatSort` is one provided solution to sorting your table's data, but it is not the only option.
In fact, the table can work with any custom sorting UI or strategy since the `MatTable` and
its interface is not tied to any one specific implementation.

#### Filtering

Angular Material does not provide a specific component to be used for filtering the `MatTable`
since there is no single common approach to adding a filter UI to table data.

A general strategy is to add an input where users can type in a filter string and listen to this
input to change what data is offered from the data source to the table.

If you are using the `MatTableDataSource`, simply provide the filter string to the
`MatTableDataSource`. The data source will reduce each row data to a serialized form and will filter
out the row if it does not contain the filter string. By default, the row data reducing function
will concatenate all the object values and convert them to lowercase.

For example, the data object `{id: 123, name: 'Mr. Smith', favoriteColor: 'blue'}` will be reduced
to `123mr. smithblue`. If your filter string was `blue` then it would be considered a match because
it is contained in the reduced string, and the row would be displayed in the table.

To override the default filtering behavior, a custom `filterPredicate` function can be set which
takes a data object and filter string and returns true if the data object is considered a match.

If you want to show a message when not data matches the filter, you can use the `*matNoDataRow`
directive.

<!--- example(table-filtering) -->

#### Selection

Right now there is no formal support for adding a selection UI to the table, but Angular Material
does offer the right components and pieces to set this up. The following steps are one solution but
it is not the only way to incorporate row selection in your table.

##### 1. Add a selection model

Get started by setting up a `SelectionModel` from `@angular/cdk/collections` that will maintain the
selection state.

```js
const initialSelection = [];
const allowMultiSelect = true;
this.selection = new SelectionModel<MyDataType>(allowMultiSelect, initialSelection);
```

##### 2. Define a selection column

Add a column definition for displaying the row checkboxes, including a main toggle checkbox for
the header. The column name should be added to the list of displayed columns provided to the
header and data row.

```html
<ng-container matColumnDef="select">
  <th mat-header-cell *matHeaderCellDef>
    <mat-checkbox (change)="$event ? toggleAllRows() : null"
                  [checked]="selection.hasValue() && isAllSelected()"
                  [indeterminate]="selection.hasValue() && !isAllSelected()">
    </mat-checkbox>
  </th>
  <td mat-cell *matCellDef="let row">
    <mat-checkbox (click)="$event.stopPropagation()"
                  (change)="$event ? selection.toggle(row) : null"
                  [checked]="selection.isSelected(row)">
    </mat-checkbox>
  </td>
</ng-container>
```

##### 3. Add event handling logic

Implement the behavior in your component's logic to handle the header's main toggle and checking
if all rows are selected.

```js
/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRows() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}
```

##### 4. Include overflow styling

Finally, adjust the styling for the select column so that its overflow is not hidden. This allows
the ripple effect to extend beyond the cell.

```css
.mat-column-select {
  overflow: initial;
}
```

<!--- example(table-selection) -->

#### Footer row

A footer row can be added to the table by adding a footer row definition to the table and adding
footer cell templates to column definitions. The footer row will be rendered after the rendered
data rows.

```html
<ng-container matColumnDef="cost">
  <th mat-header-cell *matHeaderCellDef> Cost </th>
  <td mat-cell *matCellDef="let data"> {{data.cost}} </td>
  <td mat-footer-cell *matFooterCellDef> {{totalCost}} </td>
</ng-container>

...

<tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
<tr mat-row *matRowDef="let myRowData; columns: columnsToDisplay"></tr>
<tr mat-footer-row *matFooterRowDef="columnsToDisplay"></tr>
```

<!--- example(table-footer-row) -->

#### Sticky Rows and Columns

By using `position: sticky` styling, the table's rows and columns can be fixed so that they do not
leave the viewport even when scrolled. The table provides inputs that will automatically apply the
correct CSS styling so that the rows and columns become sticky.

In order to fix the header row to the top of the scrolling viewport containing the table, you can
add a `sticky` input to the `matHeaderRowDef`.

<!--- example(table-sticky-header) -->

Similarly, this can also be applied to the table's footer row. Note that if you are using the native
`<table>` and using Safari, then the footer will only stick if `sticky` is applied to all the
rendered footer rows.

<!--- example(table-sticky-footer) -->

It is also possible to fix cell columns to the start or end of the horizontally scrolling viewport.
To do this, add the `sticky` or `stickyEnd` directive to the `ng-container` column definition.

<!--- example(table-sticky-columns) -->

Note that on Safari mobile when using the flex-based table, a cell stuck in more than one direction
will struggle to stay in the correct position as you scroll. For example, if a header row is stuck
to the top and the first column is stuck, then the top-left-most cell will appear jittery as you
scroll.

Also, sticky positioning in Edge will appear shaky for special cases. For example, if the scrolling
container has a complex box shadow and has sibling elements, the stuck cells will appear jittery.
There is currently an [open issue with Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/17514118/)
to resolve this.


#### Multiple row templates

When using the `multiTemplateDataRows` directive to support multiple rows for each data object, the context of `*matRowDef` is the same except that the `index` value is replaced by `dataIndex` and `renderIndex`.

<!--- example(table-multiple-row-template) -->

### Accessibility

By default, `MatTable` applies `role="table"`, assuming the table's contains primarily static
content. You can change the role by explicitly setting `role="grid"` or `role="treegrid"` on the
table element. While changing the role will update child element roles, such as changing
`role="cell"` to `role="gridcell"`, this does _not_ apply additional keyboard input handling or
focus management to the table.

Always provide an accessible label for your tables via `aria-label` or `aria-labelledby` on the
table element.

### Tables with `display: flex`

The `MatTable` does not require that you use a native HTML table. Instead, you can use an
alternative approach that uses `display: flex` for the table's styles.

This alternative approach replaces the native table element tags with the `MatTable` directive
selectors. For example, `<table mat-table>` becomes `<mat-table>`; `<tr mat-row>` becomes
`<mat-row>`. The following shows a previous example using this alternative template:

```html
<mat-table [dataSource]="dataSource">
  <!-- User name Definition -->
  <ng-container matColumnDef="username">
    <mat-header-cell *matHeaderCellDef> User name </mat-header-cell>
    <mat-cell *matCellDef="let row"> {{row.username}} </mat-cell>
  </ng-container>

  <!-- Age Definition -->
  <ng-container matColumnDef="age">
    <mat-header-cell *matHeaderCellDef> Age </mat-header-cell>
    <mat-cell *matCellDef="let row"> {{row.age}} </mat-cell>
  </ng-container>

  <!-- Title Definition -->
  <ng-container matColumnDef="title">
    <mat-header-cell *matHeaderCellDef> Title </mat-header-cell>
    <mat-cell *matCellDef="let row"> {{row.title}} </mat-cell>
  </ng-container>

  <!-- Header and Row Declarations -->
  <mat-header-row *matHeaderRowDef="['username', 'age', 'title']"></mat-header-row>
  <mat-row *matRowDef="let row; columns: ['username', 'age', 'title']"></mat-row>
</mat-table>
```

Note that this approach means you cannot include certain native-table features such colspan/rowspan
or have columns that resize themselves based on their content.

### Tables with `MatRipple`

By default, `MatTable` does not set up Material Design ripples for rows. A ripple effect can be
added to table rows by using the `MatRipple` directive from `@angular/material/core`. Due to
limitations in browsers, ripples cannot be applied native `th` or `tr` elements. The recommended
approach for setting up ripples is using the non-native `display: flex` variant of `MatTable`.

<!--- example(table-with-ripples) -->

More details about ripples on native table rows and their limitations can be found [in this issue](https://github.com/angular/components/issues/11883#issuecomment-634942981).
