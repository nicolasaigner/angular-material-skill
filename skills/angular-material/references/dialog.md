<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# Dialog

> Fonte: [documentação oficial](https://material.angular.dev/components/dialog/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

The `MatDialog` service can be used to open modal dialogs with Material Design styling and
animations.

#### Exemplo: `dialog-overview`

```ts
import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

export interface DialogData {
  animal: string;
  name: string;
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'dialog-overview-example',
  templateUrl: 'dialog-overview-example.html',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogOverviewExample {
  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {name: this.name(), animal: this.animal()},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly animal = model(this.data.animal);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
```

```html
<ol>
  <li>
    <mat-form-field>
      <mat-label>What's your name?</mat-label>
      <input matInput [(ngModel)]="name" />
    </mat-form-field>
  </li>
  <li>
    <button matButton="elevated" (click)="openDialog()">Pick one</button>
  </li>
  @if (animal()) {
    <li>
      You chose: <em>{{animal()}}</em>
    </li>
  }
</ol>
```

A dialog is opened by calling the `open` method with a component to be loaded and an optional
config object. The `open` method will return an instance of `MatDialogRef`:

```ts
let dialogRef = dialog.open(UserProfileComponent, {
  height: '400px',
  width: '600px',
});
```

The `MatDialogRef` provides a handle on the opened dialog. It can be used to close the dialog and to
receive notifications when the dialog has been closed. Any notification Observables will complete when the dialog closes.

```ts
dialogRef.afterClosed().subscribe(result => {
  console.log(`Dialog result: ${result}`); // Pizza!
});

dialogRef.close('Pizza!');
```

Components created via `MatDialog` can _inject_ `MatDialogRef` and use it to close the dialog
in which they are contained. When closing, an optional result value can be provided. This result
value is forwarded as the result of the `afterClosed` Observable.

```ts
@Component({/* ... */})
export class YourDialog {
  constructor(public dialogRef: MatDialogRef<YourDialog>) { }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }
}
```

### Specifying global configuration defaults
Default dialog options can be specified by providing an instance of `MatDialogConfig` for
MAT_DIALOG_DEFAULT_OPTIONS in your application's root module.

```ts
@NgModule({
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
```

### Sharing data with the Dialog component.
If you want to share data with your dialog, you can use the `data`
option to pass information to the dialog component.

```ts
let dialogRef = dialog.open(YourDialog, {
  data: { name: 'austin' },
});
```

To access the data in your dialog component, you have to use the MAT_DIALOG_DATA injection token:

```ts
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '../dialog';

@Component({
  selector: 'your-dialog',
  template: 'passed in {{ data.name }}',
})
export class YourDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string}) { }
}
```

Note that if you're using a template dialog (one that was opened with a `TemplateRef`), the data
will be available implicitly in the template:

```html
<ng-template let-data>
  Hello, {{data.name}}
</ng-template>
```

#### Exemplo: `dialog-data`

```ts
import {Component, inject} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

/**
 * @title Injecting data when opening a dialog
 */
@Component({
  selector: 'dialog-data-example',
  templateUrl: 'dialog-data-example.html',
  imports: [MatButtonModule],
})
export class DialogDataExample {
  dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(DialogDataExampleDialog, {
      data: {
        animal: 'panda',
      },
    });
  }
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
  imports: [MatDialogTitle, MatDialogContent],
})
export class DialogDataExampleDialog {
  data = inject(MAT_DIALOG_DATA);
}
```

```html
<button matButton (click)="openDialog()">Open dialog</button>
```

### Dialog content
Several directives are available to make it easier to structure your dialog content:

| Name                   | Description                                                                                                   |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| `mat-dialog-title`     | \[Attr] Dialog title, applied to a heading element (e.g., `<h1>`, `<h2>`)                                     |
| `<mat-dialog-content>` | Primary scrollable content of the dialog.                                                                     |
| `<mat-dialog-actions>` | Container for action buttons at the bottom of the dialog. Button alignment can be controlled via the `align` attribute which can be set to `end` and `center`.                                                      |
| `mat-dialog-close`     | \[Attr] Added to a `<button>`, makes the button close the dialog with an optional result from the bound value.|

For example:
```html
<h2 mat-dialog-title>Delete all elements?</h2>
<mat-dialog-content>This will delete all elements that are currently on this page and cannot be undone.</mat-dialog-content>
<mat-dialog-actions>
  <button matButton mat-dialog-close>Cancel</button>
  <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->
  <button matButton [mat-dialog-close]="true">Delete</button>
</mat-dialog-actions>
```

Once a dialog opens, the dialog will automatically focus the first tabbable element.

You can control which elements are tab stops with the `tabindex` attribute

```html
<button matButton tabindex="-1">Not Tabbable</button>
```

#### Exemplo: `dialog-content`

```ts
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'dialog-content-example',
  templateUrl: 'dialog-content-example.html',
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentExample {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentExampleDialog {}
```

```html
<button matButton (click)="openDialog()">Open dialog</button>
```

### Controlling the dialog animation
You can control the duration of the dialog's enter and exit animations using the
`enterAnimationDuration` and `exitAnimationDuration` options. If you want to disable the dialog's
animation completely, you can do so by setting the properties to `0ms`.

#### Exemplo: `dialog-animations`

```ts
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

/**
 * @title Dialog Animations
 */
@Component({
  selector: 'dialog-animations-example',
  styleUrl: 'dialog-animations-example.css',
  templateUrl: 'dialog-animations-example.html',
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExample {
  readonly dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-animations-example-dialog.html',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogAnimationsExampleDialog>);
}
```

```html
<button matButton="elevated" (click)="openDialog('0ms', '0ms')">Open dialog without animation</button>
<button matButton="elevated" (click)="openDialog('3000ms', '1500ms')">Open dialog slowly</button>
```

```css
button {
  margin-right: 8px;
}
```

### Accessibility

`MatDialog` creates modal dialogs that implements the ARIA `role="dialog"` pattern by default.
You can change the dialog's role to `alertdialog` via `MatDialogConfig`.

You should provide an accessible label to this root dialog element by setting the `ariaLabel` or
`ariaLabelledBy` properties of `MatDialogConfig`. You can additionally specify a description element
ID via the `ariaDescribedBy` property of `MatDialogConfig`.

#### Keyboard interaction
By default, the escape key closes `MatDialog`. While you can disable this behavior via
the `disableClose` property of `MatDialogConfig`, doing this breaks the expected interaction
pattern for the ARIA `role="dialog"` pattern.

#### Focus management

When opened, `MatDialog` traps browser focus such that it cannot escape the root
`role="dialog"` element. By default, the first tabbable element in the dialog receives focus.
You can customize which element receives focus with the `autoFocus` property of
`MatDialogConfig`, which supports the following values.

| Value            | Behavior                                                                 |
|------------------|--------------------------------------------------------------------------|
| `first-tabbable` | Focus the first tabbable element. This is the default setting.           |
| `first-header`   | Focus the first header element (`role="heading"`, `h1` through `h6`)     |
| `dialog`         | Focus the root `role="dialog"` element.                                  |
| Any CSS selector | Focus the first element matching the given selector.                     |

While the default setting applies the best behavior for most applications, special cases may benefit
from these alternatives. Always test your application to verify the behavior that works best for
your users.

#### Focus restoration

When closed, `MatDialog` restores focus to the element that previously held focus when the
dialog opened. However, if that previously focused element no longer exists, you must
add additional handling to return focus to an element that makes sense for the user's workflow.
Opening a dialog from a menu is one common pattern that causes this situation. The menu
closes upon clicking an item, thus the focused menu item is no longer in the DOM when the bottom
sheet attempts to restore focus.

You can add handling for this situation with the `afterClosed()` observable from `MatDialogRef`.

#### Exemplo: `dialog-from-menu` — `dialog-from-menu-example.ts` (região `focus-restoration`)

```ts
const dialogRef = this.dialog.open(DialogFromMenuExampleDialog, {restoreFocus: false});

    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
    dialogRef.afterClosed().subscribe(() => this.menuTrigger().focus());
```
