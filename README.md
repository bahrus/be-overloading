# be-overloading [TODO]

## Working like it's '95

Script HTML elements like yore, with support for ES modules.

This works, without any help from be-overloading:

```html
<button onclick="textContent = 'Try to come to life';"
>Tumble out of bed</button>
```

But:

1. There is no event (apparently) that triggers the moment the element becomes connected to the DOM fragment.  We might want to do things other than attach event handlers that are built in to the platform.  For example, we might want to:
   1.  Attach event handlers with custom names (TIL, no need for [customEvent](https://github.com/webcomponents-cg/community-protocols/issues/12#issuecomment-872415080) object, sounds quite promising).
   2.  Initialize properties from the environment (e.g. sessionStorage, IndexedDB, link preconnect tags, etc.)
   3.  Invoke some JavaScript API once the element is loaded, applying the [locality of behavior](https://www.eloquentarchitecture.com/locality-of-behavior/#:~:text=The%20documentation%20for%20htmx%20refers%20to%20something%20called,formulation%20of%20the%20quoted%20statement%20from%20Richard%20Gabriel.) principle.
2. Using ES Modules can be done, but is clunky:

```html
<output test='hello' contenteditable oninput="
      (async () => {
          console.log(getAttribute('test'));
          const {calculator} = await import('./calculator.js');
          console.log(calculator({a: 2, b: 4}));
          test();
      })()
      
      ">starting value</output>
```


be-overloading helps with these limitations.

## Example 1 [TODO]

Not quite as compact as using the platform, but...

```html
<button be-overloading="on click." onload="
    $0.textContent = 'Try to come to life';
">Tumble out of bed</button>
```

<!--
If doesn't start with open parenthesis,

export tbd = async $0 => {
    $0.addEventListener('click', e => {
        ...
    })
    
} 

and pass in the enhanced element for $0.
-->

If no event is specified, the assumption is on click (except for input element, form element).  So now, in the example below, we present markup that is as close as we will get to using the platform as far as verbosity:

## Example 2 [TODO]

```html
<button be-overloading onload="
    $0.textContent = 'Try to come to life';
">Tumble out of bed</button>
```


## Example 3 [TODO]

```html
<button be-overloading onload="
({$0}) => {
    $0.addEventListener('click', e => {
        $0.textContent = 'Try to come to life';
    });
} 
">Tumble out of bed</button>
```

<!--
Starts with open parenthesis, so minimal wrapping:
export const tbd = async ...

-->

This also works:

## Example 4 [TODO]

```html
<button be-overloading onload="
e => {
    $0.textContent = 'Try to come to life';
}
">Tumble out of bed</button>
```

<!--
Doesn't start with parenthesis,
starts with e => 

Wrap with 

export const tbd = async ({$0}) => {
    $0.addEventListener('click', 
        ...
    );
}
-->

This also works:

```html
<button be-overloading="on click, mouseover." onload="
e => {
    $0.textContent = 'Try to come to life';
}
">Tumble out of bed</button>
```

Both events will invoke the common script.

This also works:

## Example 5 [TODO]

```html
<button be-overloading='on click.  On mouseover.'
 onload="
    [
        e => $0.textContent = 'Try to come to life',
        e => $0.textContent = 'Toss and turn'
    ]
">Tumble out of bed</button>
```





