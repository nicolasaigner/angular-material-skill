<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# CDK Text Field

> Fonte: [documentação oficial](https://material.angular.dev/cdk/text-field/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

The `text-field` package provides useful utilities for working with text input fields such as
`<input>` and `<textarea>`.

### Automatically resizing a `<textarea>`

The `cdkTextareaAutosize` directive can be applied to any `<textarea>` to make it automatically
resize to fit its content. The minimum and maximum number of rows to expand to can be set via the
`cdkAutosizeMinRows` and `cdkAutosizeMaxRows` properties respectively.

The resize logic can be triggered programmatically by calling `resizeToFitContent`. This method
takes an optional boolean parameter `force` that defaults to `false`. Passing true will force the
`<textarea>` to resize even if its text content has not changed, this can be useful if the styles
affecting the `<textarea>` have changed.

#### Exemplo: `text-field-autosize-textarea`

```ts
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import {afterNextRender, Component, inject, Injector, ViewChild} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

/** @title Auto-resizing textarea */
@Component({
  selector: 'text-field-autosize-textarea-example',
  templateUrl: './text-field-autosize-textarea-example.html',
  styleUrl: './text-field-autosize-textarea-example.css',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule],
})
export class TextFieldAutosizeTextareaExample {
  private _injector = inject(Injector);

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for content to render, then trigger textarea resize.
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      },
    );
  }
}
```

```html
<mat-form-field>
  <mat-label>Font size</mat-label>
  <mat-select #fontSize value="16px" (selectionChange)="triggerResize()">
    <mat-option value="10px">10px</mat-option>
    <mat-option value="12px">12px</mat-option>
    <mat-option value="14px">14px</mat-option>
    <mat-option value="16px">16px</mat-option>
    <mat-option value="18px">18px</mat-option>
    <mat-option value="20px">20px</mat-option>
  </mat-select>
</mat-form-field>

<mat-form-field [style.fontSize]="fontSize.value">
  <mat-label>Autosize textarea</mat-label>
  <textarea matInput
            cdkTextareaAutosize
            #autosize="cdkTextareaAutosize"
            cdkAutosizeMinRows="1"
            cdkAutosizeMaxRows="5"></textarea>
</mat-form-field>
```

```css
mat-form-field {
  margin-right: 12px;
}
```

### Monitoring the autofill state of an `<input>`

The `AutofillMonitor` is an injectable service that allows the user to monitor the autofill state of
an `<input>`. It has a `monitor` method that takes an element to monitor and returns an
`Observable` of autofill event objects with a `target` and `isAutofilled` property. The observable
emits every time the autofill state of the given `<input>` changes. Any element you monitor should
eventually be unmonitored by calling `stopMonitoring` with the same element.

#### Exemplo: `text-field-autofill-monitor`

```ts
import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject} from '@angular/core';
import {AutofillMonitor} from '@angular/cdk/text-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

/** @title Monitoring autofill state with AutofillMonitor */
@Component({
  selector: 'text-field-autofill-monitor-example',
  templateUrl: './text-field-autofill-monitor-example.html',
  styleUrl: './text-field-autofill-monitor-example.css',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class TextFieldAutofillMonitorExample implements AfterViewInit, OnDestroy {
  private _autofill = inject(AutofillMonitor);

  @ViewChild('first', {read: ElementRef}) firstName: ElementRef<HTMLElement>;
  @ViewChild('last', {read: ElementRef}) lastName: ElementRef<HTMLElement>;
  firstNameAutofilled: boolean;
  lastNameAutofilled: boolean;

  ngAfterViewInit() {
    this._autofill
      .monitor(this.firstName)
      .subscribe(e => (this.firstNameAutofilled = e.isAutofilled));
    this._autofill
      .monitor(this.lastName)
      .subscribe(e => (this.lastNameAutofilled = e.isAutofilled));
  }

  ngOnDestroy() {
    this._autofill.stopMonitoring(this.firstName);
    this._autofill.stopMonitoring(this.lastName);
  }
}
```

```html
<form (submit)="$event.preventDefault()">
  <mat-form-field>
    <mat-label>First name</mat-label>
    <input matInput #first>
    @if (firstNameAutofilled) {
      <mat-hint>Autofilled!</mat-hint>
    }
  </mat-form-field>
  <mat-form-field>
    <mat-label>Last name</mat-label>
    <input matInput #last>
    @if (lastNameAutofilled) {
      <mat-hint>Autofilled!</mat-hint>
    }
  </mat-form-field>
  <button matButton="elevated">Submit</button>
</form>
```

```css
mat-form-field {
  margin-right: 12px;
}
```

To simplify this process, there is also a `cdkAutofill` directive that automatically handles
monitoring and unmonitoring and doubles as an `@Output` binding that emits when the autofill state
changes.

#### Exemplo: `text-field-autofill-directive`

```ts
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

/** @title Monitoring autofill state with cdkAutofill */
@Component({
  selector: 'text-field-autofill-directive-example',
  templateUrl: './text-field-autofill-directive-example.html',
  styleUrl: './text-field-autofill-directive-example.css',
  imports: [MatFormFieldModule, MatInputModule, TextFieldModule, MatButtonModule],
})
export class TextFieldAutofillDirectiveExample {
  firstNameAutofilled: boolean;
  lastNameAutofilled: boolean;
}
```

```html
<form (submit)="$event.preventDefault()">
  <mat-form-field>
    <mat-label>First name</mat-label>
    <input matInput (cdkAutofill)="firstNameAutofilled = $event.isAutofilled">
    @if (firstNameAutofilled) {
      <mat-hint>Autofilled!</mat-hint>
    }
  </mat-form-field>
  <mat-form-field>
    <mat-label>Last name</mat-label>
    <input matInput (cdkAutofill)="lastNameAutofilled = $event.isAutofilled">
    @if (lastNameAutofilled) {
      <mat-hint>Autofilled!</mat-hint>
    }
  </mat-form-field>
  <button matButton="elevated">Submit</button>
</form>
```

```css
mat-form-field {
  margin-right: 12px;
}
```

Note: This service requires some CSS to install animation hooks when the autofill statechanges. If
you are using Angular Material, this CSS is included as part of the `mat-core` mixin. If you are not
using Angular Material, you should include this CSS with the `text-field-autofill` mixin.

```scss
@use '@angular/cdk';

@include cdk.text-field-autofill();
```

### Styling the autofill state of an `<input>`

It can be difficult to override the browser default `background` and `color` properties on an
autofilled `<input>`. To make this simpler, the CDK includes a mixin `text-field-autofill-color`
which can be used to set these properties. It takes a `background` value as the first parameter and
an optional `color` value as the second parameter.

```scss
@use '@angular/cdk';

// Set custom autofill inputs to have no background and red text.
input.custom-autofill {
  @include cdk.text-field-autofill-color(transparent, red);
}
```
