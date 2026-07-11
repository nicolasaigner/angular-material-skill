<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# CDK Platform

> Fonte: [documentação oficial](https://material.angular.dev/cdk/platform/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

### Platform

A set of utilities that gather information about the current
platform and the different features it supports.

#### Exemplo: `cdk-platform-overview`

```ts
import {Component, inject} from '@angular/core';
import {
  getSupportedInputTypes,
  Platform,
  supportsPassiveEventListeners,
  supportsScrollBehavior,
} from '@angular/cdk/platform';

/**
 * @title Platform overview
 */
@Component({
  selector: 'cdk-platform-overview-example',
  templateUrl: 'cdk-platform-overview-example.html',
})
export class CdkPlatformOverviewExample {
  platform = inject(Platform);

  supportedInputTypes = Array.from(getSupportedInputTypes()).join(', ');
  supportsPassiveEventListeners = supportsPassiveEventListeners();
  supportsScrollBehavior = supportsScrollBehavior();
}
```

```html
<h2>Platform information:</h2>
<p>Is Android: {{platform.ANDROID}}</p>
<p>Is iOS: {{platform.IOS}}</p>
<p>Is Firefox: {{platform.FIREFOX}}</p>
<p>Is Blink: {{platform.BLINK}}</p>
<p>Is Webkit: {{platform.WEBKIT}}</p>
<p>Is Trident: {{platform.TRIDENT}}</p>
<p>Is Edge: {{platform.EDGE}}</p>
<p>Is Safari: {{platform.SAFARI}}</p>
<p>Supported input types: {{supportedInputTypes}}</p>
<p>Supports passive event listeners: {{supportsPassiveEventListeners}}</p>
<p>Supports scroll behavior: {{supportsScrollBehavior}}</p>
```
