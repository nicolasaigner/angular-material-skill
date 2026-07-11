<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# Sidenav

> Fonte: [documentação oficial](https://material.angular.dev/components/sidenav/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

Angular Material provides two sets of components designed to add collapsible side content (often
navigation, though it can be any content) alongside some primary content. These are the sidenav and
drawer components.

The sidenav components are designed to add side content to a fullscreen app. To set up a sidenav we
use three components: `<mat-sidenav-container>` which acts as a structural container for our content
and sidenav, `<mat-sidenav-content>` which represents the main content, and `<mat-sidenav>` which
represents the added side content.

#### Exemplo: `sidenav-overview`

```ts
import {Component} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';

/** @title Basic sidenav */
@Component({
  selector: 'sidenav-overview-example',
  templateUrl: 'sidenav-overview-example.html',
  styleUrl: 'sidenav-overview-example.css',
  imports: [MatSidenavModule],
})
export class SidenavOverviewExample {
  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
```

```html
@if (shouldRun) {
  <mat-sidenav-container class="example-container">
    <mat-sidenav mode="side" opened>Sidenav content</mat-sidenav>
    <mat-sidenav-content>Main content</mat-sidenav-content>
  </mat-sidenav-container>
} @else {
  <div>Please open on Stackblitz to see result</div>
}
```

```css
.example-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #eee;
}
```

The drawer component is designed to add side content to a small section of your app. This is
accomplished using the `<mat-drawer-container>`, `<mat-drawer-content>`, and `<mat-drawer>`
components, which are analogous to their sidenav equivalents. Rather than adding side content to the
app as a whole, these are designed to add side content to a small section of your app. They support
almost all of the same features, but do not support fixed positioning.

#### Exemplo: `sidenav-drawer-overview`

```ts
import {Component} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';

/** @title Basic drawer */
@Component({
  selector: 'sidenav-drawer-overview-example',
  templateUrl: 'sidenav-drawer-overview-example.html',
  styleUrl: 'sidenav-drawer-overview-example.css',
  imports: [MatSidenavModule],
})
export class SidenavDrawerOverviewExample {}
```

```html
<mat-drawer-container class="example-container">
  <mat-drawer mode="side" opened>Drawer content</mat-drawer>
  <mat-drawer-content>Main content</mat-drawer-content>
</mat-drawer-container>
```

```css
.example-container {
  width: auto;
  height: 200px;
  margin: 10px;
  border: 1px solid #555;
  /* The background property is added to clearly distinguish the borders between drawer and main
     content */
  background: #eee;
}
```

### Specifying the main and side content

Both the main and side content should be placed inside of the `<mat-sidenav-container>`, content
that you don't want to be affected by the sidenav, such as a header or footer, can be placed outside
of the container.

The side content should be wrapped in a `<mat-sidenav>` element. The `position` property can be used
to specify which end of the main content to place the side content on. `position` can be either
`start` or `end` which places the side content on the left or right respectively in left-to-right
languages. If the `position` is not set, the default value of `start` will be assumed. A
`<mat-sidenav-container>` can have up to two `<mat-sidenav>` elements total, but only one for any
given side. The `<mat-sidenav>` must be placed as an immediate child of the `<mat-sidenav-container>`.

The main content should be wrapped in a `<mat-sidenav-content>`. If no `<mat-sidenav-content>` is
specified for a `<mat-sidenav-container>`, one will be created implicitly and all of the content
inside the `<mat-sidenav-container>` other than the `<mat-sidenav>` elements will be placed inside
of it.

#### Exemplo: `sidenav-position`

```ts
import {Component} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';

/** @title Implicit main content with two sidenavs */
@Component({
  selector: 'sidenav-position-example',
  templateUrl: 'sidenav-position-example.html',
  styleUrl: 'sidenav-position-example.css',
  imports: [MatSidenavModule],
})
export class SidenavPositionExample {
  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
```

```html
@if (shouldRun) {
  <mat-sidenav-container class="example-container">
    <mat-sidenav opened mode="side">Start content</mat-sidenav>
    <mat-sidenav opened mode="side" position="end">End content</mat-sidenav>
    Implicit main content
  </mat-sidenav-container>
} @else {
  <div>Please open on Stackblitz to see result</div>
}
```

```css
.example-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
```

The following are examples of valid sidenav layouts:

```html
<!-- Creates a layout with a left-positioned sidenav and explicit content. -->
<mat-sidenav-container>
  <mat-sidenav>Start</mat-sidenav>
  <mat-sidenav-content>Main</mat-sidenav-content>
</mat-sidenav-container>
```

```html
<!-- Creates a layout with a left and right sidenav and implicit content. -->
<mat-sidenav-container>
  <mat-sidenav>Start</mat-sidenav>
  <mat-sidenav position="end">End</mat-sidenav>
  <section>Main</section>
</mat-sidenav-container>
```

```html
<!-- Creates an empty sidenav container with no sidenavs and implicit empty content. -->
<mat-sidenav-container></mat-sidenav-container>
```

And these are examples of invalid sidenav layouts:

```html
<!-- Invalid because there are two `start` position sidenavs. -->
<mat-sidenav-container>
  <mat-sidenav>Start</mat-sidenav>
  <mat-sidenav position="start">Start 2</mat-sidenav>
</mat-sidenav-container>
```

```html
<!-- Invalid because there are multiple `<mat-sidenav-content>` elements. -->
<mat-sidenav-container>
  <mat-sidenav-content>Main</mat-sidenav-content>
  <mat-sidenav-content>Main 2</mat-sidenav-content>
</mat-sidenav-container>
```

```html
<!-- Invalid because the `<mat-sidenav>` is outside of the `<mat-sidenav-container>`. -->
<mat-sidenav-container></mat-sidenav-container>
<mat-sidenav></mat-sidenav>
```

These same rules all apply to the drawer components as well.

### Opening and closing a sidenav

A `<mat-sidenav>` can be opened or closed using the `open()`, `close()` and `toggle()` methods. Each
of these methods returns a `Promise<boolean>` that will be resolved with `true` when the sidenav
finishes opening or `false` when it finishes closing.

The opened state can also be set via a property binding in the template using the `opened` property.
The property supports 2-way binding.

`<mat-sidenav>` also supports output properties for just open and just close events, The `(opened)`
and `(closed)` properties respectively.

#### Exemplo: `sidenav-open-close`

```ts
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSidenavModule} from '@angular/material/sidenav';

/** @title Sidenav open & close behavior */
@Component({
  selector: 'sidenav-open-close-example',
  templateUrl: 'sidenav-open-close-example.html',
  styleUrl: 'sidenav-open-close-example.css',
  imports: [MatSidenavModule, MatCheckboxModule, FormsModule, MatButtonModule],
})
export class SidenavOpenCloseExample {
  events: string[] = [];
  opened: boolean;

  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
```

```html
@if (shouldRun) {
  <mat-sidenav-container class="example-container">
    <mat-sidenav #sidenav mode="side" [(opened)]="opened" (opened)="events.push('open!')"
                (closed)="events.push('close!')">
      Sidenav content
    </mat-sidenav>

    <mat-sidenav-content>
      <p><mat-checkbox [(ngModel)]="opened">sidenav.opened</mat-checkbox></p>
      <p><button matButton (click)="sidenav.toggle()">sidenav.toggle()</button></p>
      <p>Events:</p>
      <div class="example-events">
        @for (e of events; track e) {
          <div>{{e}}</div>
        }
      </div>
    </mat-sidenav-content>
  </mat-sidenav-container>
} @else {
  <div>Please open on Stackblitz to see result</div>
}
```

```css
.example-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.example-events {
  width: 300px;
  height: 200px;
  overflow: auto;
  border: 1px solid #555;
}
```

All of these properties and methods work on `<mat-drawer>` as well.

### Changing the sidenav's behavior

The `<mat-sidenav>` can render in one of three different ways based on the `mode` property.

| Mode   | Description                                                                             |
|--------|-----------------------------------------------------------------------------------------|
| `over` | Sidenav floats over the primary content, which is covered by a backdrop                 |
| `push` | Sidenav pushes the primary content out of its way, also covering it with a backdrop     |
| `side` | Sidenav appears side-by-side with the main content, shrinking the main content's width to make space for the sidenav. |

If no `mode` is specified, `over` is used by default.

#### Exemplo: `sidenav-mode`

```ts
import {Component} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDrawerMode, MatSidenavModule} from '@angular/material/sidenav';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';

/** @title Sidenav with configurable mode */
@Component({
  selector: 'sidenav-mode-example',
  templateUrl: 'sidenav-mode-example.html',
  styleUrl: 'sidenav-mode-example.css',
  imports: [MatSidenavModule, MatButtonModule, MatRadioModule, FormsModule, ReactiveFormsModule],
})
export class SidenavModeExample {
  mode = new FormControl('over' as MatDrawerMode);
  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
```

```html
@if (shouldRun) {
  <mat-sidenav-container class="example-container">
    <mat-sidenav #sidenav [mode]="mode.value || 'over'">
      <p><button matButton (click)="sidenav.toggle()">Toggle</button></p>
      <p>
        <mat-radio-group class="example-radio-group" [formControl]="mode">
          <label>Mode:</label>
          <mat-radio-button value="over">Over</mat-radio-button>
          <mat-radio-button value="side">Side</mat-radio-button>
          <mat-radio-button value="push">Push</mat-radio-button>
        </mat-radio-group>
      </p>
    </mat-sidenav>

    <mat-sidenav-content>
      <p><button matButton (click)="sidenav.toggle()">Toggle</button></p>
      <p>
        <mat-radio-group class="example-radio-group" [formControl]="mode">
          <label>Mode:</label>
          <mat-radio-button value="over">Over</mat-radio-button>
          <mat-radio-button value="side">Side</mat-radio-button>
          <mat-radio-button value="push">Push</mat-radio-button>
        </mat-radio-group>
      </p>
    </mat-sidenav-content>
  </mat-sidenav-container>
} @else {
  <div>Please open on Stackblitz to see result</div>
}
```

```css
.example-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.example-radio-group {
  display: block;
  border: 1px solid #555;
  margin: 20px;
  padding: 10px;
}
```

The `over` and `push` sidenav modes show a backdrop by default, while the `side` mode does not. This
can be customized by setting the `hasBackdrop` property on `mat-sidenav-container`. Explicitly
setting `hasBackdrop` to `true` or `false` will override the default backdrop visibility setting for
all sidenavs regardless of mode. Leaving the property unset or setting it to `null` will use the
default backdrop visibility for each mode.

#### Exemplo: `sidenav-backdrop`

```ts
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';

/** @title Drawer with explicit backdrop setting */
@Component({
  selector: 'sidenav-backdrop-example',
  templateUrl: 'sidenav-backdrop-example.html',
  styleUrl: 'sidenav-backdrop-example.css',
  imports: [MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
})
export class SidenavBackdropExample {}
```

```html
<mat-drawer-container class="example-container" [hasBackdrop]="hasBackdrop.value">
  <mat-drawer #drawer [mode]="mode.value">I'm a drawer</mat-drawer>
  <mat-drawer-content>
    <mat-form-field>
      <mat-label>Sidenav mode</mat-label>
      <mat-select #mode value="side">
        <mat-option value="side">Side</mat-option>
        <mat-option value="over">Over</mat-option>
        <mat-option value="push">Push</mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field>
      <mat-label>Has backdrop</mat-label>
      <mat-select #hasBackdrop>
        <mat-option>Unset</mat-option>
        <mat-option [value]="true">True</mat-option>
        <mat-option [value]="false">False</mat-option>
      </mat-select>
    </mat-form-field>
    <button matButton="elevated" (click)="drawer.toggle()">Toggle drawer</button>
  </mat-drawer-content>
</mat-drawer-container>
```

```css
.example-container {
  width: 400px;
  height: 200px;
  margin: 12px;
  border: 1px solid #555;
}

mat-drawer-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
```

`<mat-drawer>` also supports all of these same modes and options.

### Disabling automatic close

Clicking on the backdrop or pressing the <kbd>Esc</kbd> key will normally close an open sidenav.
However, this automatic closing behavior can be disabled by setting the `disableClose` property on
the `<mat-sidenav>` or `<mat-drawer>` that you want to disable the behavior for.

Custom handling for <kbd>Esc</kbd> can be done by adding a keydown listener to the `<mat-sidenav>`.
Custom handling for backdrop clicks can be done via the `(backdropClick)` output property on
`<mat-sidenav-container>`.

#### Exemplo: `sidenav-disable-close`

```ts
import {Component, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';

/** @title Sidenav with custom escape and backdrop click behavior */
@Component({
  selector: 'sidenav-disable-close-example',
  templateUrl: 'sidenav-disable-close-example.html',
  styleUrl: 'sidenav-disable-close-example.css',
  imports: [MatSidenavModule, MatButtonModule],
})
export class SidenavDisableCloseExample {
  @ViewChild('sidenav') sidenav: MatSidenav;

  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
```

```html
@if (shouldRun) {
  <mat-sidenav-container
      class="example-container" (backdropClick)="close('backdrop')">
    <mat-sidenav #sidenav (keydown.escape)="close('escape')" disableClose>
      <p><button matButton (click)="close('toggle button')">Toggle</button></p>
    </mat-sidenav>

    <mat-sidenav-content>
      <p><button matButton (click)="sidenav.open()">Open</button></p>
      <p>Closed due to: {{reason}}</p>
    </mat-sidenav-content>
  </mat-sidenav-container>
} @else {
  <div>Please open on Stackblitz to see result</div>
}
```

```css
.example-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
```

### Resizing an open sidenav
By default, Material will only measure and resize the drawer container in a few key moments
(on open, on window resize, on mode change) in order to avoid layout thrashing, however there
are cases where this can be problematic. If your app requires for a drawer to change its width
while it is open, you can use the `autosize` option to tell Material to continue measuring it.
Note that you should use this option **at your own risk**, because it could cause performance
issues.

#### Exemplo: `sidenav-autosize`

```ts
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';

/**
 * @title Autosize sidenav
 */
@Component({
  selector: 'sidenav-autosize-example',
  templateUrl: 'sidenav-autosize-example.html',
  styleUrl: 'sidenav-autosize-example.css',
  imports: [MatSidenavModule, MatButtonModule],
})
export class SidenavAutosizeExample {
  showFiller = false;
}
```

```html
<mat-drawer-container class="example-container" autosize>
  <mat-drawer #drawer class="example-sidenav" mode="side">
    <p>Auto-resizing sidenav</p>
    @if (showFiller) {
      <p>Lorem, ipsum dolor sit amet consectetur.</p>
    }
    <button (click)="showFiller = !showFiller" matButton="elevated">
      Toggle extra text
    </button>
  </mat-drawer>

  <div class="example-sidenav-content">
    <button type="button" matButton (click)="drawer.toggle()">
      Toggle sidenav
    </button>
  </div>

</mat-drawer-container>
```

```css
.example-container {
  width: 500px;
  height: 300px;
  border: 1px solid rgba(0, 0, 0, 0.5);
}

.example-sidenav-content {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.example-sidenav {
  padding: 20px;
}
```

### Setting the sidenav's size

The `<mat-sidenav>` and `<mat-drawer>` will, by default, fit the size of its content. The width can
be explicitly set via CSS:

```css
mat-sidenav {
  width: 200px;
}
```

Try to avoid percent based width as `resize` events are not (yet) supported.

### Fixed position sidenavs

For `<mat-sidenav>` only (not `<mat-drawer>`) fixed positioning is supported. It can be enabled by
setting the `fixedInViewport` property. Additionally, top and bottom space can be set via the
`fixedTopGap` and `fixedBottomGap`. These properties accept a pixel value amount of space to add at
the top or bottom.

#### Exemplo: `sidenav-fixed`

```ts
import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';

/** @title Fixed sidenav */
@Component({
  selector: 'sidenav-fixed-example',
  templateUrl: 'sidenav-fixed-example.html',
  styleUrl: 'sidenav-fixed-example.css',
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class SidenavFixedExample {
  private _formBuilder = inject(FormBuilder);

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });

  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
```

```html
@if (shouldRun) {
  <mat-toolbar class="example-header">Header</mat-toolbar>

  <mat-sidenav-container class="example-container">
    <mat-sidenav #sidenav mode="side" opened class="example-sidenav"
                 [fixedInViewport]="options.value.fixed" [fixedTopGap]="options.value.top"
                 [fixedBottomGap]="options.value.bottom">
      {{options.value.fixed ? 'Fixed' : 'Non-fixed'}} Sidenav
    </mat-sidenav>

    <mat-sidenav-content [formGroup]="options">
      <p><mat-checkbox formControlName="fixed">Fixed</mat-checkbox></p>
      <p><mat-form-field>
        <mat-label>Top gap</mat-label>
        <input matInput type="number" formControlName="top">
      </mat-form-field></p>
      <p><mat-form-field>
        <mat-label>Bottom gap</mat-label>
        <input matInput type="number" formControlName="bottom">
      </mat-form-field></p>
      <p><button matButton (click)="sidenav.toggle()">Toggle</button></p>
    </mat-sidenav-content>
  </mat-sidenav-container>

  <mat-toolbar class="example-footer">Footer</mat-toolbar>
} @else {
  <div>Please open on StackBlitz to see result</div>
}
```

```css
.example-container {
  position: absolute;
  top: 60px;
  bottom: 60px;
  left: 0;
  right: 0;
}

.example-sidenav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  background: rgba(255, 0, 0, 0.5);
}

.example-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.example-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
```

### Creating a responsive layout for mobile & desktop

A sidenav often needs to behave differently on a mobile vs a desktop display. On a desktop, it may
make sense to have just the content section scroll. However, on mobile you often want the body to be
the element that scrolls; this allows the address bar to auto-hide. The sidenav can be styled with
CSS to adjust to either type of device.

#### Exemplo: `sidenav-responsive`

```ts
import {MediaMatcher} from '@angular/cdk/layout';
import {Component, OnDestroy, inject, signal} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

/** @title Responsive sidenav */
@Component({
  selector: 'sidenav-responsive-example',
  templateUrl: 'sidenav-responsive-example.html',
  styleUrl: 'sidenav-responsive-example.css',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule],
})
export class SidenavResponsiveExample implements OnDestroy {
  protected readonly fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  protected readonly fillerContent = Array.from(
    {length: 50},
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  );

  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor() {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  protected readonly shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(
    window.location.host,
  );
}
```

```html
@if (shouldRun) {
  <div class="example-container" [class.example-is-mobile]="isMobile()">
    <mat-toolbar class="example-toolbar">
      <button matIconButton (click)="snav.toggle()"><mat-icon>menu</mat-icon></button>
      <h1 class="example-app-name">Responsive App</h1>
    </mat-toolbar>

    <mat-sidenav-container class="example-sidenav-container"
                          [style.marginTop.px]="isMobile() ? 56 : 0">
      <mat-sidenav #snav [mode]="isMobile() ? 'over' : 'side'"
                  [fixedInViewport]="isMobile()" fixedTopGap="56">
        <mat-nav-list>
          @for (nav of fillerNav; track nav) {
            <a mat-list-item>{{nav}}</a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        @for (content of fillerContent; track content) {
    <p>{{content}}</p>
  }
      </mat-sidenav-content>
    </mat-sidenav-container>
  </div>
} @else {
  <div>Please open on Stackblitz to see result</div>
}
```

```css
.example-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.example-is-mobile .example-toolbar {
  position: fixed;
  /* Make sure the toolbar will stay on top of the content as it scrolls past. */
  z-index: 2;
}

h1.example-app-name {
  margin-left: 8px;
}

.example-sidenav-container {
  /* When the sidenav is not fixed, stretch the sidenav container to fill the available space. This
     causes `<mat-sidenav-content>` to act as our scrolling element for desktop layouts. */
  flex: 1;
}

.example-is-mobile .example-sidenav-container {
  /* When the sidenav is fixed, don't constrain the height of the sidenav container. This allows the
     `<body>` to be our scrolling element for mobile layouts. */
  flex: 1 0 auto;
}
```

### Reacting to scroll events inside the sidenav container

To react to scrolling inside the `<mat-sidenav-container>`, you can get a hold of the underlying
`CdkScrollable` instance through the `MatSidenavContainer`.

```ts
class YourComponent implements AfterViewInit {
  @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;

  ngAfterViewInit() {
    this.sidenavContainer.scrollable.elementScrolled().subscribe(() => /* react to scrolling */);
  }
}
```

### Accessibility

The `<mat-sidenav>` and `<mat-sidenav-content>` should each be given an appropriate `role` attribute
depending on the context in which they are used.

For example, a `<mat-sidenav>` that contains links
to other pages might be marked `role="navigation"`, whereas one that contains a table of
contents about might be marked as `role="directory"`. If there is no more specific role that
describes your sidenav, `role="region"` is recommended.

Similarly, the `<mat-sidenav-content>` should be given a role based on what it contains. If it
represents the primary content of the page, it may make sense to mark it `role="main"`. If no more
specific role makes sense, `role="region"` is again a good fallback.

#### Focus management
The sidenav has the ability to capture focus. This behavior is turned on for the `push` and `over` modes and it is off for `side` mode. You can change its default behavior by the `autoFocus` input.

By default the first tabbable element will receive focus upon open. If you want a different element to be focused, you can set the `cdkFocusInitial` attribute on it.

### Troubleshooting

#### Error: A drawer was already declared for 'position="..."'

This error is thrown if you have more than one sidenav or drawer in a given container with the same
`position`. The `position` property defaults to `start`, so the issue may just be that you forgot to
mark the `end` sidenav with `position="end"`.
