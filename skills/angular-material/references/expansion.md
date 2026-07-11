<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# Expansion

> Fonte: [documentação oficial](https://material.angular.dev/components/expansion/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

`<mat-expansion-panel>` provides an expandable details-summary view.

#### Exemplo: `expansion-overview`

```ts
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'expansion-overview-example',
  templateUrl: 'expansion-overview-example.html',
  imports: [MatExpansionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionOverviewExample {
  readonly panelOpenState = signal(false);
}
```

```html
<mat-accordion>
  <mat-expansion-panel hideToggle>
    <mat-expansion-panel-header>
      <mat-panel-title> This is the expansion title </mat-panel-title>
      <mat-panel-description> This is a summary of the content </mat-panel-description>
    </mat-expansion-panel-header>
    <p>This is the primary content of the panel.</p>
  </mat-expansion-panel>
  <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">
    <mat-expansion-panel-header>
      <mat-panel-title> Self aware panel </mat-panel-title>
      <mat-panel-description>
        Currently I am {{panelOpenState() ? 'open' : 'closed'}}
      </mat-panel-description>
    </mat-expansion-panel-header>
    <p>I'm visible because I am open</p>
  </mat-expansion-panel>
</mat-accordion>
```

### Expansion-panel content

#### Header

The `<mat-expansion-panel-header>` shows a summary of the panel content and acts
as the control for expanding and collapsing. This header may optionally contain an
`<mat-panel-title>` and an `<mat-panel-description>`, which format the content of the
header to align with Material Design specifications.

#### Exemplo: `expansion-overview` — `expansion-overview-example.html` (região `basic-panel`)

```html
<mat-expansion-panel hideToggle>
    <mat-expansion-panel-header>
      <mat-panel-title> This is the expansion title </mat-panel-title>
      <mat-panel-description> This is a summary of the content </mat-panel-description>
    </mat-expansion-panel-header>
    <p>This is the primary content of the panel.</p>
  </mat-expansion-panel>
```

By default, the expansion-panel header includes a toggle icon at the end of the
header to indicate the expansion state. This icon can be hidden via the
`hideToggle` property.

#### Exemplo: `expansion-overview` — `expansion-overview-example.html` (região `hide-toggle`)

```html
<mat-expansion-panel hideToggle>
```

#### Action bar

Actions may optionally be included at the bottom of the panel, visible only when the expansion
is in its expanded state.

#### Exemplo: `expansion-steps` — `expansion-steps-example.html` (região `action-bar`)

```html
<mat-action-row>
      <button matButton (click)="nextStep()">Next</button>
    </mat-action-row>
```

#### Disabling a panel

Expansion panels can be disabled using the `disabled` attribute. A disabled expansion panel can't
be toggled by the user, but can still be manipulated programmatically.

#### Exemplo: `expansion-expand-collapse-all` — `expansion-expand-collapse-all-example.html` (região `disabled`)

```html
<mat-expansion-panel disabled>
```

### Accordion

Multiple expansion-panels can be combined into an accordion. The `multi="true"` input allows the
expansions state to be set independently of each other. When `multi="false"` (default) just one
panel can be expanded at a given time:

#### Exemplo: `expansion-expand-collapse-all` — `expansion-expand-collapse-all-example.html` (região `multi`)

```html
<mat-accordion class="example-headers-align" multi>
```

### Lazy rendering

By default, the expansion panel content will be initialized even when the panel is closed.
To instead defer initialization until the panel is open, the content should be provided as
an `ng-template`:

```html
<mat-expansion-panel>
  <mat-expansion-panel-header>
    This is the expansion title
  </mat-expansion-panel-header>

  <ng-template matExpansionPanelContent>
    Some deferred content
  </ng-template>
</mat-expansion-panel>
```

### Accessibility

`MatExpansionPanel` imitates the experience of the native `<details>` and `<summary>` elements.
The expansion panel header applies `role="button"` and the `aria-controls` attribute with the
content element's ID.

Because expansion panel headers are buttons, avoid adding interactive controls as children
of `<mat-expansion-panel-header>`, including buttons and anchors.
