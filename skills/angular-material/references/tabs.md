<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# Tabs

> Fonte: [documentação oficial](https://material.angular.dev/components/tabs/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

Angular Material tabs organize content into separate views where only one view can be
visible at a time. Each tab's label is shown in the tab header and the active
tab's label is designated with the animated ink bar. When the list of tab labels exceeds the width
of the header, pagination controls appear to let the user scroll left and right across the labels.

The active tab may be set using the `selectedIndex` input or when the user selects one of the
tab labels in the header.

#### Exemplo: `tab-group-basic`

```ts
import {Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

/**
 * @title Basic use of the tab group
 */
@Component({
  selector: 'tab-group-basic-example',
  templateUrl: 'tab-group-basic-example.html',
  imports: [MatTabsModule],
})
export class TabGroupBasicExample {}
```

```html
<mat-tab-group>
  <mat-tab label="First"> Content 1 </mat-tab>
  <mat-tab label="Second"> Content 2 </mat-tab>
  <mat-tab label="Third"> Content 3 </mat-tab>
</mat-tab-group>
```

### Events

The `selectedTabChange` output event is emitted when the active tab changes.

The `focusChange` output event is emitted when the user puts focus on any of the tab labels in
the header, usually through keyboard navigation.

### Labels

If a tab's label is only text then the simple tab-group API can be used.

> _(exemplo `{"example": "tab-group-basic", "file": "tab-group-basic-example.html"}` não encontrado no upstream)_

For more complex labels, add a template with the `mat-tab-label` directive inside the `mat-tab`.

> _(exemplo `{"example": "tab-group-custom-label", "file": "tab-group-custom-label-example.html", "region": "label-directive"}` não encontrado no upstream)_

### Dynamic Height

By default, the tab group will not change its height to the height of the currently active tab. To
change this, set the `dynamicHeight` input to true. The tab body will animate its height according
 to the height of the active tab.

 > _(exemplo `{"example": "tab-group-dynamic-height", "file": "tab-group-dynamic-height-example.html", "region": "dynamic-height"}` não encontrado no upstream)_

### Tabs and navigation
While `<mat-tab-group>` is used to switch between views within a single route, `<nav mat-tab-nav-bar>`
provides a tab-like UI for navigating between routes.

 > _(exemplo `{"example": "tab-nav-bar-basic", "file": "tab-nav-bar-basic-example.html", "region": "mat-tab-nav"}` não encontrado no upstream)_

The `mat-tab-nav-bar` is not tied to any particular router; it works with normal `<a>` elements and
uses the `active` property to determine which tab is currently active. The corresponding
`<router-outlet>` must be wrapped in an `<mat-tab-nav-panel>` component and should typically be
placed relatively close to the `mat-tab-nav-bar` (see [Accessibility](#accessibility)).

### Lazy Loading
By default, the tab contents are eagerly loaded. Eagerly loaded tabs
will initialize the child components but not inject them into the DOM
until the tab is activated.


If the tab contains several complex child components or the tab's contents
rely on DOM calculations during initialization, it is advised
to lazy load the tab's content.

Tab contents can be lazy loaded by declaring the body in a `ng-template`
with the `matTabContent` attribute.

 > _(exemplo `{"example": "tab-group-lazy-loaded", "file": "tab-group-lazy-loaded-example.html", "region": "mat-tab-content"}` não encontrado no upstream)_

### Label alignment
If you want to align the tab labels in the center or towards the end of the container, you can
do so using the `[mat-align-tabs]` attribute.

 > _(exemplo `{"example": "tab-group-align", "file": "tab-group-align-example.html", "region": "align-start"}` não encontrado no upstream)_

### Controlling the tab animation
You can control the duration of the tabs' animation using the `animationDuration` input. If you
want to disable the animation completely, you can do so by setting the properties to `0ms`. The
duration can be configured globally using the `MAT_TABS_CONFIG` injection token.

 > _(exemplo `{"example": "tab-group-animations", "file": "tab-group-animations-example.html", "region": "slow-animation-duration"}` não encontrado no upstream)_

### Keeping the tab content inside the DOM while it's off-screen
By default the `<mat-tab-group>` will remove the content of off-screen tabs from the DOM until they
come into the view. This is optimal for most cases since it keeps the DOM size smaller, but it
isn't great for others like when a tab has an `<audio>` or `<video>` element, because the content
will be re-initialized whenever the user navigates to the tab. If you want to keep the content of
off-screen tabs in the DOM, you can set the `preserveContent` input to `true`.

#### Exemplo: `tab-group-preserve-content`

```ts
import {Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

/**
 * @title Tab group that keeps its content inside the DOM when it's off-screen.
 */
@Component({
  selector: 'tab-group-preserve-content-example',
  templateUrl: 'tab-group-preserve-content-example.html',
  imports: [MatTabsModule],
})
export class TabGroupPreserveContentExample {}
```

```html
<p>Start the video in the first tab and navigate to the second one to see how it keeps playing.</p>

<mat-tab-group preserveContent>
  <mat-tab label="First">
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/B-lipaiZII8"
      style="border: 0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>
  </mat-tab>
  <mat-tab label="Second">Note how the video from the previous tab is still playing.</mat-tab>
</mat-tab-group>
```

### Accessibility
`MatTabGroup` and `MatTabNavBar` both implement the
[ARIA Tabs design pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel). Both components
compose `tablist`, `tab`, and `tabpanel` elements with handling for keyboard inputs and focus
management.

When using `MatTabNavBar`, you should place the `<mat-tab-nav-panel>` component relatively close to
if not immediately adjacent to the `<nav mat-tab-nav-bar>` component so that it's easy for screen
reader users to identify the association.

#### Labels

Always provide an accessible label via `aria-label` or `aria-describedby` for tabs without
descriptive text content.

When using `MatTabNavGroup`, always specify a label for the `<nav>` element.

#### Keyboard interaction

`MatTabGroup` and `MatTabNavBar` both implement the following keyboard interactions:

| Shortcut             | Action                     |
|----------------------|----------------------------|
| `LEFT_ARROW`         | Move focus to previous tab |
| `RIGHT_ARROW`        | Move focus to next tab     |
| `HOME`               | Move focus to first tab    |
| `END`                | Move focus to last tab     |
| `SPACE` or `ENTER`   | Switch to focused tab      |
