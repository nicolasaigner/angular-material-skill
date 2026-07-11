<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# CDK Keycodes

> Fonte: [documentação oficial](https://material.angular.dev/cdk/keycodes/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

### KeyCodes
 
Commonly used keycode constants.

#### Example
```ts
import {Directive} from '@angular/core';
import {UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW} from '@angular/cdk/keycodes';

@Directive({
  selector: '[count-arrows]'
  host: {
    (keypress): 'handleKeyPress($event)'
  }
})
export class ArrowCounterDirective {
  arrowPressCount = 0;

  handleKeyPress(event: KeyboardEvent) {
    if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(event.keyCode)) {
      this.arrowPresscount++;
    }
  }
}
```
