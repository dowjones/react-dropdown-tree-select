# Styling using Bootstrap

Due to its minimalistic and simple nature, the control adapts to the parent or container page's style easily. This example simply uses bootstrap's css instead of the base css used in the vanilla demo.

It then goes beyond to show some extra customizations done using only CSS - e.g. replacing the expand/collapse icons with that of [FontAwesome's](http://fontawesome.io/) plus/minus icons as shown below:

```css
/* First we tell it to use FontAwesome fonts */
.bootstrap-demo .toggle {
  font: normal normal normal 12px/1 FontAwesome;
  color:#555
}

/* Then we specify the icons */
.bootstrap-demo .toggle.collapsed::after {
  content: "\f067";
}

.bootstrap-demo .toggle.expanded::after {
  content: "\f068";
}
```

Checkout [index.css](./index.css) for details.

## Why doesn't the control let me render my own control for icons and controls?
I have considered using an "adapter" system where the caller can specify their own react component allowing them complete control over how HTML is rendered. E.g. the icon adapter could render something like `<i class="fa fa-plus" />` which avoids the pain of authoring custom CSS.

While the idea may sound simple, in reality it is not. The controls are not only responsible for rendering HTML, but also for hooking up events and interactions that alter the internal state. It is certainly doable, but it comes at an additional cost of increased complexity. I prefer few lines of extra CSS over increased complexity and byte size of the overall control.

I might reconsider this stance if there is growing demand for such customization, so let me know by creating an issue.