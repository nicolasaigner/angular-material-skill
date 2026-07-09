<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# Button

> Fonte: [documentação oficial](https://material.angular.dev/components/button/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

Angular Material buttons are native `<button>` or `<a>` elements enhanced with Material Design
styling.

#### Exemplo: `button-overview`

```ts
import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

/**
 * @title Button overview
 */
@Component({
  selector: 'button-overview-example',
  templateUrl: 'button-overview-example.html',
  styleUrl: 'button-overview-example.css',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
})
export class ButtonOverviewExample {}
```

```html
<section>
  <div class="example-label">Text</div>
  <div class="example-button-row">
    <button matButton>Basic</button>
    <button matButton disabled>Disabled</button>
    <a matButton href="https://www.google.com/" target="_blank">Link</a>
  </div>
</section>
<mat-divider/>
<section>
  <div class="example-label">Elevated</div>
  <div class="example-button-row">
    <button matButton="elevated">Basic</button>
    <button matButton="elevated" disabled>Disabled</button>
    <a matButton="elevated" href="https://www.google.com/" target="_blank">Link</a>
  </div>
</section>
<mat-divider/>
<section>
  <div class="example-label">Outlined</div>
  <div class="example-button-row">
    <button matButton="outlined">Basic</button>
    <button matButton="outlined" disabled>Disabled</button>
    <a matButton="outlined" href="https://www.google.com/" target="_blank">Link</a>
  </div>
</section>
<mat-divider/>
<section>
  <div class="example-label">Filled</div>
  <div class="example-button-row">
    <button matButton="filled">Basic</button>
    <button matButton="filled" disabled>Disabled</button>
    <a matButton="filled" href="https://www.google.com/" target="_blank">Link</a>
  </div>
</section>
<mat-divider/>
<section>
  <div class="example-label">Tonal</div>
  <div class="example-button-row">
    <button matButton="tonal" >Basic</button>
    <button matButton="tonal"  disabled>Disabled</button>
    <a matButton="tonal" href="https://www.google.com/" target="_blank">Link</a>
  </div>
</section>
<mat-divider/>
<section>
  <div class="example-label">Icon</div>
  <div class="example-button-row">
    <div class="example-flex-container">
      <button matIconButton aria-label="Example icon button with a vertical three dot icon">
        <mat-icon>more_vert</mat-icon>
      </button>
      <button matIconButton disabled aria-label="Example icon button with a open in new tab icon">
        <mat-icon>open_in_new</mat-icon>
      </button>
    </div>
  </div>
</section>
<mat-divider/>
<section>
  <div class="example-label">Floating Action Button (FAB)</div>
  <div class="example-button-row">
    <div class="example-flex-container">
      <button matFab aria-label="Example icon button with a delete icon">
        <mat-icon>delete</mat-icon>
      </button>
      <button matFab disabled aria-label="Example icon button with a heart icon">
        <mat-icon>favorite</mat-icon>
      </button>
    </div>
  </div>
</section>
<mat-divider/>
<section>
  <div class="example-label">Mini FAB</div>
  <div class="example-button-row">
    <div class="example-flex-container">
      <button matMiniFab aria-label="Example icon button with a menu icon">
        <mat-icon>menu</mat-icon>
      </button>
      <button matMiniFab disabled aria-label="Example icon button with a home icon">
        <mat-icon>home</mat-icon>
      </button>
    </div>
  </div>
</section>
<mat-divider/>
<section>
  <div class="example-label">Extended FAB</div>
  <div class="example-button-row">
    <div class="example-flex-container">
      <button matFab extended>
        <mat-icon>favorite</mat-icon>
        Basic
      </button>
      <button matFab extended disabled>
        <mat-icon>favorite</mat-icon>
        Disabled
      </button>
      <a matFab extended routerLink=".">
        <mat-icon>favorite</mat-icon>
        Link
      </a>
    </div>
  </div>
</section>
```

```css
section {
  display: flex;
  align-items: center;
}

.example-label {
  font-size: 14px;
  margin: 0 16px 0 8px;
  min-width: 120px;
}

.example-button-row {
  max-width: 600px;
}

.example-button-row .mat-mdc-button-base {
  margin: 8px 8px 8px 0;
}

.example-flex-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
```

Native `<button>` and `<a>` elements are always used in order to provide the most straightforward
and accessible experience for users. A `<button>` element should be used whenever some _action_
is performed. An `<a>` element should be used whenever the user will _navigate_ to another view.


There are several button variants, each applied as an attribute:

| Attribute            | Description                                                              |
|----------------------|--------------------------------------------------------------------------|
| `matButton`          | Rectangular button that can contain text and icons                       |
| `matIconButton`      | Smaller, circular button, meant to contain an icon and no text           |
| `matFab`             | Rectangular button w/ elevation and rounded corners, meant to contain an icon. Can be [extended](https://material.angular.dev/components/button/overview#extended-fab-buttons) to a rectangle to also fit a label               |
| `matMiniFab`         | Smaller variant of `matFab`                                              |


Additionally, the `matButton` has several appearances that can be set using the `matButton`
attribute, for example `matButton="outlined"`:

| Appearance   | Description                                                                      |
|--------------|----------------------------------------------------------------------------------|
| `text`       | Default appearance. Text buttons are used for the lowest priority actions, especially when presenting multiple options. |
| `filled`     | High-emphasis buttons used for final or unblocking actions in a flow, such as saving or confirming. |
| `tonal`      | Medium-emphasis buttons often used for final or unblocking actions in a flow, but with less visual emphasis than a filled button. |
| `outlined`   | Medium-emphasis buttons often used for actions that need attention but aren't the primary action. |
| `elevated`   | Medium-emphasis buttons often used when a button requires visual separation from a patterned background. |


### Extended FAB buttons
Traditional floating action buttons (FAB) buttons are circular and only have space for a single
icon. However, you can add the `extended` attribute to allow the fab to expand into a rounded
rectangle shape with space for a text label in addition to the icon. Only full sized fabs support
the `extended` attribute, mini FABs do not.

```html
<button matFab extended>
  <mat-icon>home</mat-icon>
  Home
</button>
```

### Interactive disabled buttons
Native disabled `<button>` elements cannot receive focus and do not dispatch any events. This can
be problematic in some cases because it can prevent the app from telling the user why the button is
disabled. You can use the `disabledInteractive` input to style the button as disabled but allow for
it to receive focus and dispatch events. The button will have `aria-disabled="true"` for assistive
technology. The behavior can be configured globally through the `MAT_BUTTON_CONFIG` injection token.

**Note:** Using the `disabledInteractive` input can result in buttons that previously prevented
actions to no longer do so, for example a submit button in a form. When using this input, you should
guard against such cases in your component.

#### Exemplo: `button-disabled-interactive`

```ts
import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';

/**
 * @title Interactive disabled buttons
 */
@Component({
  selector: 'button-disabled-interactive-example',
  templateUrl: 'button-disabled-interactive-example.html',
  styleUrl: 'button-disabled-interactive-example.css',
  imports: [MatButton, MatTooltip],
})
export class ButtonDisabledInteractiveExample {}
```

```html
<button
  matButton="elevated"
  disabled
  disabledInteractive
  matTooltip="This is a tooltip!">Disabled button allowing interactivity</button>

<button
  matButton="elevated"
  disabled
  matTooltip="This is a tooltip!">Default disabled button</button>
```

```css
button {
  margin-right: 8px;
}
```

### Accessibility
Angular Material uses native `<button>` and `<a>` elements to ensure an accessible experience by
default. A `<button>` element should be used for any interaction that _performs an action on the
current page_. An `<a>` element should be used for any interaction that _navigates to another
URL_. All standard accessibility best practices for buttons and anchors apply to `MatButton`.

#### Capitalization
Using ALL CAPS in the button text itself causes issues for screen-readers, which
will read the text character-by-character. It can also cause issues for localization.
We recommend not changing the default capitalization for the button text.

#### Disabling anchors
`MatAnchor` supports disabling an anchor in addition to the features provided by the native
`<a>` element. When you disable an anchor, the component sets `aria-disabled="true"` and
`tabindex="-1"`. Always test disabled anchors in your application to ensure compatibility
with any assistive technology your application supports.

#### Buttons with icons
Buttons or links containing only icons (such as `matFab`, `matMiniFab`, and `matIconButton`)
should be given a meaningful label via `aria-label` or `aria-labelledby`. [See the documentation
for `MatIcon`](https://material.angular.dev/components/icon) for more
information on using icons in buttons. Additionally, to be fully accessible the icon should have a minimum touch-target of 48x48 to ensure that the icon is easily clickable particularly on mobile devices and small screens.

#### Toggle buttons
[See the documentation for `MatButtonToggle`](https://material.angular.dev/components/button-toggle)
for information on stateful toggle buttons.
