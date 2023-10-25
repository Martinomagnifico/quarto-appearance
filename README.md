# Appearance

## For Quarto

A quarto extension for [Reveal.js](https://revealjs.com) that animates elements sequentially like in Powerpoint. Perfect for online portfolios or other presentations with images.

[![Screenshot](https://martinomagnifico.github.io/reveal.js-appearance/screenshot.png)](https://martinomagnifico.github.io/quarto-appearance/docs/demo.html)

In Powerpoint you can make slides with items that appear automatically with effects. This plugin for Reveal.js tries to achieve the same result. It's easy to set up. It uses Animate.css by Daniel Eden for the animations, with some changes to allow for a non-animated state. 

* [Demo](https://martinomagnifico.github.io/quarto-appearance/docs/demo.html)

The animations will start automatically after or at each slide or fragment change if the HTML is set up to use Appearance.

Version 1.3.0 adds an option to animate the words in a sentence, or the letters in a word.


## Basics

There are really only three steps:

1. Install Appearance
2. Edit the markup to add animation classes
2. Enjoy the animations



## Installation

### Installation with Quarto

```console
quarto add martinomagnifico/quarto-appearance
```

### Other installations

The original plugin is also published to npm. To use Appearance in a normal Reveal.js installation, or for more information about the original plugin, go to [Martinomagnifico/reveal.js-appearance](https://github.com/Martinomagnifico/reveal.js-appearance)


## Setup

### Styling
The styling of Appearance is automatically inserted, either loaded through NPM or from the plugin folder. Two files are inserted: The first one is Animate.css by Daniel Eden for the basic animations, we add it through a CDN. The second file adds to the first stylesheet to allow for a non-animated state.


### Markup

It is easy to set up your HTML structure for Appearance. Each element that you want to animate uses a base class and an animation class. ***You only have to add an animation class*** because the base class is automatically added to any element with an animation class. The names of these animation classes are defined by [Animate.css](https://animate.style). In the example below, you can see that the animation class is `animate__bounceInLeft`:  

```markdown
* [Add it to any text element.]{.animate__bounceInLeft}
* [Like list items, or headers.]{.animate__bounceInLeft}
* [It adds some impact.]{.animate__bounceInLeft}
```

When you are working with Markdown, this can be a chore so if you do not want to add all these classes, you can set the option `autoappear` to `true` (see Configuration below) and let Appearance do the heavy work. You do not need to add any markup and it will stay like this:

```markdown
* Add it to any text element
* Like list items, or headers.
* It adds some attention.
```

#### HEADS UP: Quarto and list items
Quarto will wrap the content of a list item in a span if you try to add attibutes to it. It is unclear why Quarto does this. ***But the bulletpoint or list number of those list items will then not be animated***. Appearance can fix this if you add `data-appear-parent="true"` to the list item, like this: 

```markdown
* [Add it to any text element.]{.animate__bounceInLeft data-appear-parent="true"}
* [Like list items, or headers.]{.animate__bounceInLeft data-appear-parent="true"}
* [It adds some impact.]{.animate__bounceInLeft data-appear-parent="true" }
```

or globally from the YAML settings like below. The `data-appear-parent` attribute is then not needed: 

```yaml
format:
  revealjs:
    ...
    appearance:
      appearparents: true
```

#### Animating words and letters

To nicely animate the words in a heading, or the letters of a word, add an animation class to it, and add a data-attribute for the kind of split you want: 

``` markdown
### [Split into words]{.animate__fadeInDown data-split="words"}
### [Split into letters]{.animate__fadeInDown data-split="letters"}
```


## Now change it

It is easy to change the effects for Appearance. 

### Changing the delay

Here's how to change the delay per element: 

```markdown
![](img/1.jpg){.animate__fadeInDown data-delay="200"}
![](img/2.jpg){.animate__fadeInDown data-delay="160"}
![](img/3.jpg){.animate__fadeInDown data-delay="120"}
```

### Changing the speed

You can change the speed of each animation, using the tempo classes from Animate.css:

```markdown
![](img/1.jpg){.animate__bounceIn .animate__slower}
![](img/2.jpg){.animate__bounceIn .animate__slow}
![](img/3.jpg){.animate__bounceIn}
![](img/4.jpg){.animate__bounceIn .animate__fast}
![](img/5.jpg){.animate__bounceIn .animate__faster}
```

### Changing word and letter animations

For words and letters, the same techniques can be used. 

Note that the data-delay also gets copied to the smaller elements in it, which means that there is no more 'whole sentence' or 'whole word' to delay. By default, the whole element then gets the delay (depending on if it is following other animations) as defined in the `delay` option in the Configuration, but it can be overriden by an optional `data-container-delay`. 

``` markdown
### [Split into words]{.animate__fadeInDown data-split="words"}
### [Split into letters]{.animate__fadeInDown .animate__faster data-split="letters" data-delay="75" data-container-delay="800"}
```


### Changing the 'appearevent'
When you navigate from slide to slide, you can set transition effects in Reveal. These effects take some time. That's why, by default, Appearance only starts when the slide transition has ended. 

There are cases however, where  there is hardly any transition, for example, when going from an autoanimate slide to another. Reveal then suppresses the user-set transition to a short opacity change. Starting *together with* the transition might then be nicer. You can use any of the following events:

* *slidetransitionend* (default, Appearance will always start animating elements after the transition)
* *slidechanged* (Appearance will always start together with the transition)
* *auto* (Appearance will start together with the transition, but only on autoanimate slides, other slides will use *slidetransitionend*)

```markdown
## Change when appearance starts {auto-animate=true data-appearevent="autoanimate"}
* [This is list item 1]{.animate__fadeInLeft}
* [This is list item 2]{.animate__fadeInLeft}
* [This is list item 3]{.animate__fadeInLeft}
```

These same event triggers can be set through the `appearevent` option in the global configuration. 

When using Appearance inside an autoanimate slide, and changing the appearevent to `slidechanged` or `auto`, keep in mind that Reveal transforms opacity for all non-autoanimate items, while Appearance does the same on most of the effects. To avoid strange behaviour, wrap these Appearance items in a parent. For example, a list of animated bullet points works well, because the animated class is on the children, not the parent. Separate headings or other elements do not have that, so should be wrapped.


## Autoappear

You can simplify the addition of animation classes.

Sometimes (for example with Markdown), adding classes to elements is a chore. Appearance can automatically add animation classes to specific elements (tags or other selectors) in the presentation (with the option autoappear) or per slide (with data-autoappear).

### Global autoappear mode

With the option `autoappear` set to `true`, ALL elements in the presentation that have a certain selector (and that are not already classed with your base animation class, like 'animated') will subsequently get this class, and thus an animation. These selectors and the animations can be set in the configuration options like this:  

```yaml
format:
  revealjs:
    ...
    appearance:
      autoappear: true
      autoelements: {"ul li": "animate__fadeInLeft"}
```

You can add any selector and animation class to this object. You can use a simple JSON object, or more elaborate like this (you can also mix them): `{"ul li": {"animation":"animate__fadeInLeft", "speed":"slow", "delay":"100"}}`. An object like that can contain the following keys:

* animation
* speed
* delay
* split
* container-delay 

where the last two keys are specific for word- and letter-animations.

If you choose to write all your animation selectors and properties globally, you no longer need to add any classes to the markup and it can stay like this:

```markdown
* Add it to any text element
* Like list items, or headers.
* It adds some attention.
```


### Local auto-appear

With the option `autoappear` set to `false`, the above still works, but only on a data-attribute basis. ONLY elements in the presentation that are inside sections or fragments with a data-attribute of `data-autoappear` will be animated automatically, with the selectors and animations as described in the configuration: 

```yaml
format:
  revealjs:
    ...
    appearance:
      autoappear: false
      autoelements: {"ul li": "animate__fadeInLeft"}
```

```markdown
## Local auto-appear {data-autoappear=true}
* This is list item 1
* This is list item 2
```


### Local auto-appear, specified

You can also add a JSON object to the slide’s `data-autoappear`, with specific elements, their animations class(es) as a string or an object with animations class(es), optional speed and optional delay.  

In the example below you can see that mixing strings and objects is perfectly fine. The `ul li` has a simple string for only the animation class(es) while the `h2` uses an object with keys. 

```markdown
## Local auto-appear, specified {data-autoappear="{'ul li':'animate__fadeInRight', 'h2': {'animation':'animate__fadeInDown', 'speed':'slow', 'delay':'100'}}"}

* This is list item 1
* This is list item 2
```

## Configuration

There are a few options that you can change in the YAML options. The values below are default and do not need to be set if not changed.

```yaml
format:
  revealjs:
    appearance:
      hideagain: true
      delay: 300
      appearevent: 'slidetransitionend'
      autoappear: false
      autoelements: false
      appearparents: false
revealjs-plugins:
  - appearance
```


* **`hideagain`**: Change this (true/false) if you want to see the shown elements if you go back.
* **`delay`**: Base time in ms between appearances.
* **`appearevent`**: Use a specific event at which Appearance starts.
* **`autoappear`**: Use this when you do not want to add classes to each item that you want to appear, and just let Appearance add animation classes to (all of) the provided elements in the presentation. See "Autoappear" mode above.
* **`autoelements`**: These are the elements that `autoappear` will target. Each element has a selector and an animation class. If `autoappear` is off, the elements will still get animation if the section contains a `data-autoappear` attribute.
* **`appearparents`**: Quarto will wrap the content of a list item in a span if you try to add attibutes to it. It is unclear why Quarto does this. ***But the bulletpoint or list number of those list items will then not be animated***. This can be fixed globally by setting `appearparents: true`. (It can also be set per item, with a data-attribute: `data-appear-parent="true"`) 


## Like it?
If you like it, please star this repo! 

And if you want to show off what you made with it, please do :-)


## License
MIT licensed

Copyright (C) 2023 Martijn De Jongh (Martino)