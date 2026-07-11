<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# CDK Observers

> Fonte: [documentação oficial](https://material.angular.dev/cdk/observers/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

The `observers` package provides convenience directives built on top of native web platform
observers, such as MutationObserver.


### cdkObserveContent

A directive for observing when the content of the host element changes. An event is emitted when a
mutation to the content is observed.

```html
<div class="projected-content-wrapper" (cdkObserveContent)="projectContentChanged()">
  <ng-content></ng-content>
</div>
```

Directive also can be used for observing any type of content
```html
<div class="content-wrapper" (click)="changeText()" (cdkObserveContent)="textChanged()">
  {{ text }}
</div>
```
