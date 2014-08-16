#jQuery keySelection

jQuery keySelection is a lightweight jQuery plugin (3kb) for cycling through arbitrary element collections with arrow keys. Collection members are selectable by keyboard or mouse.

keySelection will always reflect the current dom state, so you can dynamically add elements to the dom and they will be added to the keySelection element collection if they have the required .selection-item class.


##demo & download

See [here]() for a demo.

Download the [production version][min] (_minified_) or the [development version][max].

[min]: https://raw.github.com/
[max]: https://raw.github.com/1pxsolidblack/

##basic usage:

keySelection adds a ".selected" class to an element if it is selected with the enter key, the space key or by a mouse click. It adds a ".key-hover" class to an element if it is chosen with the arrow keys or if it is selected. You need to add your own css, to see the effects of keySelection.

```html
    <div class="container">
	    <p class="selection-item">I'm selectable!</p>
	    <ul>
		    <li class="selection-item">Me too!</li>
		    <li>I'm not selectable</li>
	    </ul>
    </div>
```

```javascript
$(".container").keySelection();
```
##options (with default values):
```javascript
    $(".container").keySelection({
    	exclusiveKeyListener: true, //prevent event propagation for enter, space, up, down, right, left
	    scrollToKeyHoverItem: true,
	    scrollContainer: "html,body",
	    scrollMargin: 10, //space above item, after scrolling
	    scrollAnimationDuration:150,	
	    selectionItemSelector:".selection-item"
    });
```
##events
keySelection triggers events if an element is selected or keyHovered:

```javascript
    $(".container").on("keySelection.keyHover", function(e){console.log(e.keyHoverElement);});
    $(".container").on("keySelection.selection", function(e){console.log(e.selectedElement);});
```

##api

```javascript
    $(".container").keySelection("stop"); //stop keySelection
    $(".container").keySelection("start"); //start it again
    $(".container").keySelection("up"); //set previous element to .key-hover
    $(".container").keySelection("down"); //set next element to .key-hover
    $(".container").keySelection("select"); //select .key-hover element
```

##motivation & alternatives

I needed a lightweight arrow key plugin for arbitrary and dynamically changing element collections (not only lists). I didn't find one, so I made my own.

If you are looking for more advanced features, I recommend [Selectonic](http://anovi.github.io/selectonic/).

##license

The MIT License (MIT)

Copyright (c) 2014 Christian Voigt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.