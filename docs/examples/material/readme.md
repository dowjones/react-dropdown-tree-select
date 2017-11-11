# Styling using Bootstrap

Due to its minimalistic and simple nature, the control adapts to the parent or container page's style easily. This example  uses custom css (based on Material Design principles) instead of the base css used in the vanilla demo.

It then goes beyond to show some extra customizations done using only CSS - e.g. replacing the expand/collapse icons with that of [Material Design's](https://material.io/icons/) expand_more/expand_less icons as shown below:

```css
/* First we tell it to use Material fonts */
.mdl-demo .toggle {
  font: normal normal normal 18px/1 'Material Icons';
  color: #555;
  white-space: pre;
  margin-right: 4px;
}

/* Then we specify the icons */
.mdl-demo .toggle.collapsed::after {
  cursor: pointer;
  content: "\E5CF";
  vertical-align: middle;
}

.mdl-demo .toggle.expanded::after {
  cursor: pointer;
  content: "\E5CE";
  vertical-align: middle;
}
```

And replacing the standard checkbox with Material Design's rotating check:

```css

.mdl-demo .checkbox-item {
  position: relative;
  width: 1rem;
  height: 1rem;
  margin-right: .75rem;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: 0;
  vertical-align: middle;
}

.mdl-demo .checkbox-item:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  border: 2px solid #aaa;
  transition: all 0.3s ease-in-out;
}

.mdl-demo .checkbox-item:checked:before {
  height: 50%;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  border-top-style: none;
  border-right-style: none;
  border-color: #2196f3;
}
```

Checkout [index.css](./index.css) for details.

## Why doesn't the control let me render my own control for icons and controls?
I have considered using an "adapter" system where the caller can specify their own react component allowing them complete control over how HTML is rendered. E.g. the icon adapter could render something like `<i class="fa fa-plus" />` which avoids the pain of authoring custom CSS. This would be extra helpful in case of Google's Material Design since most of Material design requires lot of extra markup for all those fancy animation effects (see [material.io checkboxes](https://material.io/components/web/catalog/input-controls/checkboxes/) which require 4 `divs`, 1 `svg` and 1 native checkbox element to render a single checkbox!). 

While the idea may sound simple, in reality it is not. The controls are not only responsible for rendering HTML, but also for hooking up events and interactions that alter the internal state. It is certainly doable, but it comes at an additional cost of increased complexity. I prefer few lines of extra CSS over increased complexity and byte size of the overall control.

I might reconsider this stance if there is growing demand for such customization, so let me know by creating an issue.