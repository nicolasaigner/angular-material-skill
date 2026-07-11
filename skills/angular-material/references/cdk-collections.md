<!-- GENERATED por angular-material-skill a partir de angular/components@21.0.2. NÃO editar à mão. -->

# CDK Collections

> Fonte: [documentação oficial](https://material.angular.dev/cdk/collections/overview) — derivado de [`angular/components`](https://github.com/angular/components) (21.0.2), licença MIT. Ver NOTICE.

The `collections` package provides a set of utilities for managing collections.

### `SelectionModel`
`SelectionModel` is a utility for powering selection of one or more options from a list.
This model is used in components such as the selection list, table selections and chip lists.

#### Basic Usage
```javascript
const model = new SelectionModel(
  true,   // multiple selection or not
  [2,1,3] // initial selected values
);

// select a value
model.select(4);
console.log(model.selected.length) //->  4

// deselect a value
model.deselect(4);
console.log(model.selected.length) //->  3

// toggle a value
model.toggle(4);
console.log(model.selected.length) //->  4

// check for selection
console.log(model.isSelected(4)) //-> true

// sort the selections
console.log(model.sort()) //-> [1,2,3,4]

// listen for changes
model.changed.subscribe(s => console.log(s));
```
