<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# Autocomplete

> Fonte: [documentação oficial](https://material.angular.dev/components/autocomplete/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

The autocomplete is a normal text input enhanced by a panel of suggested options.

### Simple autocomplete

Start by creating the autocomplete panel and the options displayed inside it. Each option should be
defined by a `mat-option` tag. Set each option's value property to whatever you'd like the value
of the text input to be when that option is selected.

#### Exemplo: `autocomplete-simple` — `autocomplete-simple-example.html` (região `mat-autocomplete`)

```html
<mat-autocomplete #auto="matAutocomplete">
      @for (option of options; track option) {
        <mat-option [value]="option">{{option}}</mat-option>
      }
    </mat-autocomplete>
```

Next, create the input and set the `matAutocomplete` input to refer to the template reference we assigned
to the autocomplete. Let's assume you're using the `formControl` directive from `ReactiveFormsModule` to
track the value of the input.

> Note: It is possible to use template-driven forms instead, if you prefer. We use reactive forms
in this example because it makes subscribing to changes in the input's value easy. For this
example, be sure to import `ReactiveFormsModule` from `@angular/forms` into your `NgModule`.
If you are unfamiliar with using reactive forms, you can read more about the subject in the
[Angular documentation](https://angular.dev/guide/forms/reactive-forms).

Now we'll need to link the text input to its panel. We can do this by exporting the autocomplete
panel instance into a local template variable (here we called it "auto"), and binding that variable
to the input's `matAutocomplete` property.

#### Exemplo: `autocomplete-simple` — `autocomplete-simple-example.html` (região `input`)

```html
<input type="text"
           placeholder="Pick one"
           aria-label="Number"
           matInput
           [formControl]="myControl"
           [matAutocomplete]="auto">
```

### Adding a custom filter

At this point, the autocomplete panel should be toggleable on focus and options should be
selectable. But if we want our options to filter when we type, we need to add a custom filter.

You can filter the options in any way you like based on the text input\*. Here we will perform a
simple string test on the option value to see if it matches the input value, starting from the
option's first letter. We already have access to the built-in `valueChanges` Observable on the
`FormControl`, so we can simply map the text input's values to the suggested options by passing
them through this filter. The resulting Observable, `filteredOptions`, can be added to the
template in place of the `options` property using the `async` pipe.

Below we are also priming our value change stream with an empty string so that the options are
filtered by that value on init (before there are any value changes).

\*For optimal accessibility, you may want to consider adding text guidance on the page to explain
filter criteria. This is especially helpful for screenreader users if you're using a non-standard
filter that doesn't limit matches to the beginning of the string.

#### Exemplo: `autocomplete-filter`

```ts
import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

/**
 * @title Filter autocomplete
 */
@Component({
  selector: 'autocomplete-filter-example',
  templateUrl: 'autocomplete-filter-example.html',
  styleUrl: 'autocomplete-filter-example.css',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class AutocompleteFilterExample implements OnInit {
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
```

```html
<form class="example-form">
  <mat-form-field class="example-full-width">
    <mat-label>Number</mat-label>
    <input type="text"
           placeholder="Pick one"
           aria-label="Number"
           matInput
           [formControl]="myControl"
           [matAutocomplete]="auto">
    <mat-autocomplete #auto="matAutocomplete">
      @for (option of filteredOptions | async; track option) {
        <mat-option [value]="option">{{option}}</mat-option>
      }
    </mat-autocomplete>
  </mat-form-field>
</form>
```

```css
.example-form {
  min-width: 150px;
  max-width: 500px;
  width: 100%;
}

.example-full-width {
  width: 100%;
}
```

### Setting separate control and display values

If you want the option's control value (what is saved in the form) to be different than the option's
display value (what is displayed in the text field), you'll need to set the `displayWith`
property on your autocomplete element. A common use case for this might be if you want to save your
data as an object, but display just one of the option's string properties.

To make this work, create a function on your component class that maps the control value to the
desired display value. Then bind it to the autocomplete's `displayWith` property.

#### Exemplo: `autocomplete-display`

```ts
import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export interface User {
  name: string;
}

/**
 * @title Display value autocomplete
 */
@Component({
  selector: 'autocomplete-display-example',
  templateUrl: 'autocomplete-display-example.html',
  styleUrl: 'autocomplete-display-example.css',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class AutocompleteDisplayExample implements OnInit {
  myControl = new FormControl<string | User>('');
  options: User[] = [{name: 'Mary'}, {name: 'Shelley'}, {name: 'Igor'}];
  filteredOptions: Observable<User[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
```

```html
<form class="example-form">
  <mat-form-field class="example-full-width">
    <mat-label>Assignee</mat-label>
    <input type="text" matInput [formControl]="myControl" [matAutocomplete]="auto">
    <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn">
      @for (option of filteredOptions | async; track option) {
        <mat-option [value]="option">{{option.name}}</mat-option>
      }
    </mat-autocomplete>
  </mat-form-field>
</form>
```

```css
.example-form {
  min-width: 150px;
  max-width: 500px;
  width: 100%;
}

.example-full-width {
  width: 100%;
}
```

### Require an option to be selected

By default, the autocomplete will accept the value that the user typed into the input field.
Instead, if you want to ensure that an option from the autocomplete was selected, you can
enable the `requireSelection` input on `mat-autocomplete`. This will change the behavior of
the autocomplete in the following ways:
1. If the user opens the autocomplete, changes its value, but doesn't select anything, the
autocomplete value will be reset back to `null`.
2. If the user opens and closes the autocomplete without changing the value, the old value will
be preserved.

This behavior can be configured globally using the `MAT_AUTOCOMPLETE_DEFAULT_OPTIONS`
injection token.

#### Exemplo: `autocomplete-require-selection`

```ts
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

/**
 * @title Require an autocomplete option to be selected
 */
@Component({
  selector: 'autocomplete-require-selection-example',
  templateUrl: 'autocomplete-require-selection-example.html',
  styleUrl: 'autocomplete-require-selection-example.css',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
})
export class AutocompleteRequireSelectionExample {
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three', 'Four', 'Five'];
  filteredOptions: string[];

  constructor() {
    this.filteredOptions = this.options.slice();
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.toLowerCase().includes(filterValue));
  }
}
```

```html
Control value: {{myControl.value || 'empty'}}

<form class="example-form">
  <mat-form-field class="example-full-width">
    <mat-label>Number</mat-label>
    <input #input
           type="text"
           placeholder="Pick one"
           matInput
           [formControl]="myControl"
           [matAutocomplete]="auto"
           (input)="filter()"
           (focus)="filter()">
    <mat-autocomplete requireSelection #auto="matAutocomplete">
      @for (option of filteredOptions; track option) {
        <mat-option [value]="option">{{option}}</mat-option>
      }
    </mat-autocomplete>
  </mat-form-field>
</form>
```

```css
.example-form {
  min-width: 150px;
  max-width: 500px;
  width: 100%;
  margin-top: 16px;
}

.example-full-width {
  width: 100%;
}
```

### Automatically highlighting the first option

If your use case requires for the first autocomplete option to be highlighted when the user opens
the panel, you can do so by setting the `autoActiveFirstOption` input on the `mat-autocomplete`
component. This behavior can be configured globally using the `MAT_AUTOCOMPLETE_DEFAULT_OPTIONS`
injection token.

#### Exemplo: `autocomplete-auto-active-first-option`

```ts
import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

/**
 * @title Highlight the first autocomplete option
 */
@Component({
  selector: 'autocomplete-auto-active-first-option-example',
  templateUrl: 'autocomplete-auto-active-first-option-example.html',
  styleUrl: 'autocomplete-auto-active-first-option-example.css',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class AutocompleteAutoActiveFirstOptionExample implements OnInit {
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
```

```html
<form class="example-form">
  <mat-form-field class="example-full-width">
    <mat-label>Number</mat-label>
    <input type="text"
           placeholder="Pick one"
           aria-label="Number"
           matInput
           [formControl]="myControl"
           [matAutocomplete]="auto">
    <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
      @for (option of filteredOptions | async; track option) {
        <mat-option [value]="option">{{option}}</mat-option>
      }
    </mat-autocomplete>
  </mat-form-field>
</form>
```

```css
.example-form {
  min-width: 150px;
  max-width: 500px;
  width: 100%;
}

.example-full-width {
  width: 100%;
}
```

### Autocomplete on a custom input element

While `mat-autocomplete` supports attaching itself to a `mat-form-field`, you can also set it on
any other `input` element using the `matAutocomplete` attribute. This allows you to customize what
the input looks like without having to bring in the extra functionality from `mat-form-field`.

#### Exemplo: `autocomplete-plain-input`

```ts
import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

/**
 * @title Plain input autocomplete
 */
@Component({
  selector: 'autocomplete-plain-input-example',
  templateUrl: 'autocomplete-plain-input-example.html',
  styleUrl: 'autocomplete-plain-input-example.css',
  imports: [FormsModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe],
})
export class AutocompletePlainInputExample implements OnInit {
  control = new FormControl('');
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  filteredStreets: Observable<string[]>;

  ngOnInit() {
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
```

```html
<form class="example-form">
  <input type="text"
         placeholder="Search for a street"
         [formControl]="control"
         [matAutocomplete]="auto"
         class="example-input">
  <mat-autocomplete #auto="matAutocomplete">
    @for (street of filteredStreets | async; track street) {
      <mat-option [value]="street">{{street}}</mat-option>
    }
  </mat-autocomplete>
</form>
```

```css
.example-form {
  min-width: 150px;
  max-width: 500px;
  width: 100%;
}

.example-full-width {
  width: 100%;
}

.example-input {
  max-width: 100%;
  width: 300px;
}
```

### Attaching the autocomplete panel to a different element

By default the autocomplete panel will be attached to your input element, however in some cases you
may want it to attach to a different container element. You can change the element that the
autocomplete is attached to using the `matAutocompleteOrigin` directive together with the
`matAutocompleteConnectedTo` input:

```html
<div class="custom-wrapper-example" matAutocompleteOrigin #origin="matAutocompleteOrigin">
  <input
    matInput
    [formControl]="myControl"
    [matAutocomplete]="auto"
    [matAutocompleteConnectedTo]="origin">
</div>

<mat-autocomplete #auto="matAutocomplete">
  @for (option of options; track option) {
    <mat-option [value]="option">{{option}}</mat-option>
  }
</mat-autocomplete>
```

### Keyboard interaction
| Keyboard shortcut                      | Action                                                         |
|----------------------------------------|----------------------------------------------------------------|
| <kbd>Down Arrow</kbd>                  | Navigate to the next option.                                   |
| <kbd>Up Arrow</kbd>                    | Navigate to the previous option.                               |
| <kbd>Enter</kbd>                       | Select the active option.                                      |
| <kbd>Escape</kbd>                      | Close the autocomplete panel.                                  |
| <kbd>Alt</kbd> + <kbd>Up Arrow</kbd>   | Close the autocomplete panel.                                  |
| <kbd>Alt</kbd> + <kbd>Down Arrow</kbd> | Open the autocomplete panel if there are any matching options. |

### Option groups
`mat-option` can be collected into groups using the `mat-optgroup` element:
#### Exemplo: `autocomplete-optgroup` — `autocomplete-optgroup-example.html` (região `mat-autocomplete`)

```html
<mat-autocomplete #autoGroup="matAutocomplete">
        @for (group of stateGroupOptions | async; track group) {
          <mat-optgroup [label]="group.letter">
            @for (name of group.names; track name) {
              <mat-option [value]="name">{{name}}</mat-option>
            }
          </mat-optgroup>
        }
    </mat-autocomplete>
```

### Accessibility

`MatAutocomplete` implements the ARIA combobox interaction pattern. The text input trigger specifies
`role="combobox"` while the content of the pop-up applies `role="listbox"`. Because of this listbox
pattern, you should _not_ put other interactive controls, such as buttons or checkboxes, inside
an autocomplete option. Nesting interactive controls like this interferes with most assistive
technology.

Always provide an accessible label for the autocomplete. This can be done by using a
`<mat-label>` inside of `<mat-form-field>`, a native `<label>` element, the `aria-label`
attribute, or the `aria-labelledby` attribute.

`MatAutocomplete` preserves focus on the text trigger, using `aria-activedescendant` to support
navigation though the autocomplete options.

By default, `MatAutocomplete` displays a checkmark to identify the selected item. While you can hide
the checkmark indicator via `hideSingleSelectionIndicator`, this makes the component less accessible
by making it harder or impossible for users to visually identify selected items.
