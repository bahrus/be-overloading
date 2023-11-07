# be-overloading [TODO]

## Working like it's '95

Script HTML elements like yore, with support for ES modules.

This works, using only the platform:

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
<button be-overloading="on click events." onload="
    $0.textContent = 'Try to come to life';
">Tumble out of bed</button>
```

What this does, behind the scenes:

If the onload text doesn't start with either an open parenthesis, or with e =>, it does quite a bit of wrapping.  It turns the previous script into:

```JavaScript
export const onload = async ($0, context) => {
    const fn = () => {
        $0.textContent = 'Try to come to life';
    }
    const {events} = context; // events = ['click']
    if(events !== undefined){
        for(const event of events){
            const ab = new AbortController();
            context.abortControllers[event] = ab;
            $0.addEventListener(event, e => {
                fn();
            }, {signal: ab.signal});
        }
    }
}
```

*be-overloading* invokes onload right away, passing in the element it adorns, and the event type specified in the attribute.  It then detaches itself from memory, as its work is done.

The example above is meant to save the developer from a number of common keystrokes.  But if the developer wants to take the reigns, to do anything off the beaten track, we have the following more verbose example:

## Example 2 [TODO]

```html
<button be-overloading onload="
($0) => {
    $0.addEventListener('click', e => {
        $0.textContent = 'Try to come to life.';
    });
} 
">Tumble out of bed</button>
```

What this does behind the scenes:  Since the script begins with an open parenthesis, we apply minimal wrapping.  It just adds the async keyword, essentially, and then invokes.  


This also works:

## Example 3 [TODO]

```html
<button be-overloading="on click events." onload="
e => {
    $0.textContent = 'Try to come to life';
}
">Tumble out of bed</button>
```

Here, it doesn't start with parenthesis, but *be-overloading* has special logic that looks for script that looks for e =>

It wraps such logic into the same expanded script, yada yada.


This also works:

```html
<button be-overloading="on click, mouseover events." onload="
e => {
    switch(e.type){
        case 'click':
            $0.textContent = 'Try to come to life';
            break;
        case 'mouseover':
            $0.textContent = 'Toss and turn';
            break;
    }
    
}
">Tumble out of bed</button>
```

Both events (click, mouseover) will invoke the same common script.

The developer can add conditional logic within to do different things based on which event type was triggered.

## Example 4 OnUnload

If attaching event listeners to remote elements and/or mutation observers, it is probably a good idea to clean up those listeners.  The challenge is where to store the signals?

That is one of the uses of the "context" parameter.

## Example 5  With expressions [TODO]

[be-computed](https://github.com/bahrus/be-computed) makes use of another feature (behind the scenes):

```html
<div be-overloading="
    with line1=`Barely gettin' by, it's all takin' and no givin'`.
    With line2=`They just use your mind`.
    With line3=`And you never get the credit`.
    With line4=`It's enough to drive you crazy if you let it`.
    "
    onload="
        const html = String.raw;
        const stanza = html`
            <div>${line1}</div>
            <div>${line2}</div>
            <div>${line3}</div>
            <div>${line4}</div>
        `;
        $0.firstChild.innerHTML = stanza;
        return stanza;
>
    <section></section>
</div>
```

What this does, behind the scenes:

```JavaScript
export const onload = async ($0, context) => {
    const line1 = `Barely gettin' by, it's all takin' and no givin'`;
    const line2 = `They just use your mind`;
    const line3 = `And you never get the credit`;
    const line4 = `It's enough to drive you crazy if you let it`;
    const fn = () => {
        const html = String.raw;
        const stanza = html`
            <div>${line1}</div>
            <div>${line2}</div>
            <div>${line3}</div>
            <div>${line4}</div>
        `;
        $0.firstChild.innerHTML = stanza;
        return stanza;
    }
    const {events} = context; // events = ['click']
    if(events !== undefined){
        for(const event of events){
            const ab = new AbortController();
            context.abortControllers[event] = ab;
            $0.addEventListener(event, e => {
                fn();
            }, {signal: ab.signal});
        }
    }else{
        fn();
    }
}
```











