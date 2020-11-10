# Vanilla TeuxDeux

This is clone of the [TeuxDeux](https://teuxdeux.com) app, but implemented without any build steps, dependencies and images. Vanilla HTML, CSS and JavaScript. **44 KB** unminified and unbundled.

It was inspired by [Vanila Todo](https://github.com/morris/vanilla-todo) but using more modern web technologies and techniques, though sacrificing IE < 11 support.

**[Try it out yourself](https://ivank.github.io/vanilla-teuxdeux/)**

This is for the most part a case study, not a finished product. The app itself - [TeuxDeux](https://teuxdeux.com) looks like the perfect candidate. A clear cut Single Page Application (SPA), which by its nature requres a more sophisticated state management approach than jquery-esqe "the html dom is my state", but still simple enough to be implemented with reasonable amount of effort.

This case study is an attempt to answer the question - can we build a modern, animated, stateful SPA with **no dependencies and no build steps**, in a concise and maintainable way. The short answer, that I hope this proves is that it's actually _possible_.

So let's map out the journey, what I've learned and what I've concluded.

## Poor man's redux

There are a lot of techniques for handling complex state on the frontend. There is [redux](https://redux.js.org)'s pure functions and global state machine approach, or even formalized hierarchical state machines, like [xstate](https://xstate.js.org). We can use [vue style observables](https://vuejs.org/v2/api) or [reactive programming](http://reactivex.io), etc.

The truth is this is such a complex problem that the fickle world of frontend developers has not yet converged on a prefered way of going about it, at least at the time of this writing.

I just went ahead and picked redux's approach for this study as it requires very few lines to actually implement, is robust enough for our needs and due to its immutable nature, offers great debuggability. Its also familiar enough to future audiences so this work doesn't look _too_ alien, always a concern for something so bespoke. The other approaches popularized by [Angular](https://angular.io), [Vue](https://vuejs.org), [Svetle](https://svelte.dev), etc. are great too, but I'm personally more familiar with redux, so I decided to go that way.

As it turned out, all of the business logic naturally settled into [js/state.js](js/state.js) file with all the action creators and reducer logic. Action creators were key, as without TypeScript it would have been quite tricky to track down which actions are fired when, but having the actions and responses in the same file allows for very simple debugging.

Another benefit of having a global state is that it's simple to **implement undo / redo functionality**, something that is a must in a modern application.

## Poor man's virtual dom

One of the key innovations that Reactjs brought to the table oh so many moons ago, is the concept of a [virtual dom](https://reactjs.org/docs/faq-internals.html). I wanted to make the app iteslf feel familiar to people coming from React. It turns out if you use the Redux style global state, its very easy to build your application on the same principles, without the addition of react itself. Each component has a function called "update" that goes like this:

```javascript
function update(prevState, nextState, el) {
  // ... figure out what's different between prev and next state
  // ... apply changes
}
```

Every element that we dynamically create has its own unique id, which allows us to drill into the global state to get the components's new data. As the state is arranged to be as flat as possible, this makes even deeply nested changes simple enough.

```javascript
function update(prevState, nextState, el) {
  const data = nextState.todoItems.find((item) => item.id === el.id);
  el.querySelector('[data-title]').innerText = data.title;
}
```

This leaves one big problem though. Lists of elements. If for example we had a list of `['t1', 't2', 't3']`, that changed to `['t3', 't2', 't4']` we'll need to figure out that we've removed `t1`, rearranged `t2` and `t3` and added `t4`. This is what virtual doms really gives you, sparing you the cost of just removing all the elements and re-adding them with new values.

I've implemented a very naive "element list update", that accomplishes this reliably enough, though not very efficiently in [js/components/html.js](js/components/html.js#L3-L34). Next step would probably be pulling in the venerable [Levenshtein distance algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance) that could give us the needed steps to convert "previous array" to "next array" in the least possible steps, but I thought such things were out of the scope of this study. Perhaps a TODO.

I've skipped doing any performance optimisations, as I didn't really encounter any problems. We could easily roll our sleeves and implement the React way of dealing with it by checking state equality before performing updates. Since our data is immutable, and flat this would be particularly easy, but I'll leave this as an exercise to the reader.

## Poor man's lodash/fp

With the choice of redux-style state machine, we have a big unwieldy state object that we want to modify immutably. This is usually done with the help of destructuring.

```javascript
const nextState = { ...prevState, todoItems: [...prevState.todoItems, newItem] };
```

Having a complex deeply nested object makes those updates not very ergonomic. As a long user of [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide) to accomplish those tasks I thought of giving it a go and making a [mini lodash utils](js/utils.js) library to help with all those updates. The functions behave exactly like the lodash/fp ones, though they have their curring "baked in", since I know that's the style I'll be always using them.

## No images

Alongside with the "no dependencies" and "no buildsteps" I also added one more arbitrary thing - "no images". Unicode is full to the brim with all sorts of crazy charecters that should be enough to satisfy every fancy. If we sacrifice individual style we should be able to minimize load times even further.

Granted this would hardly work for a commercial application, but I'm sure a lot of open source projects that are more concerned with functionality than with branding can utilize this technique too.

## Just using DOM as your state

One way of doing "progressive enhancement" web apps is to rely on the html itself to be your state. For example (layout-grid)[https://github.com/clippings/layout-grid]. This would involve setting data attributes to express what the current state of the component is. This is very powerful as that means you can control your whole app just with the HTML of it and you can make any additions / removes to the html work correctly without additional book keeping of state.

This app however is complex enough that such an approach is not possible. Since it involves todo lists attached to dates, it would be fairly hard to keep all of the day's todo list inside of the html dom. A real state management technique is required.

## Why not web components?

In the process of this study, I did attempt implementing the whole app with web components. While feasible, web components today appear to not be the right tool for the job.

For example there is no universal way, without polyfills, to use custom elements based on existing html tags. No custom "li" element was a dealbreaker for me, as I wanted to make the html semantically correct, and a todo list are you guessed it - `ol` tags.

Also components attempt to hide their internal workings as much as possible, and using internal shadow dom, while perfect for structuring the contents of those new elements, was quite painful to style properly.

If you throw away shadow dom, then you end up with just a simple class. Since I'm not personally not a huge fan of OOP inheritance, that ended up as just two pure helper functions - `create` and `update` at which point web components did not offer any additional functionality.

I'll grant that web components excel in making separated components, that can be dropped into any webpage and just work. In the process they try very hard to guard said components from anything that's present on the page - js, html, css etc. For an SPA though we are in full control of all of the components. This makes the implementation based on them a lot more complex and unwieldy than necessary.

## CSS!

The css side of this project is probably a lot less thought out. Going about it without resets and frameworks turned out surprisingly unpleasant. The web really needs a global reset for all of those styles, why wasn't there a globally recoginsed html attribute to do such a reset is a mystery to me. I'd likely develop my own styleguide / mini-framework and use that, something akin to a more specialized [tailwind](https://tailwindcss.com) perhaps but this should suffice for the time being.

## Testing?

Currently there is no testing. Sadly w3c and the like have not blessed us with an established way of writing tests for the dom, or javascript in general. It will not be practical I think to "not use any dependencies" since any testing would involve some anyway.

It's more of a TODO section until I figure out a nice way to structure the tests.

## Conclusion

I think the presence of so many "Poor man's" points make it obvious that JavaScript today is lacking a lot of fundamentals. Core libraries and technologies that are sorely needed if one wants to build reliable and maintainable SPAs.

What I personally lacked the most were `state management`, `virtual dom` and `lodash/fp`'s utility functions. If those were present, it might have been very simple to implement the app itself. A lot of the things we've relied on transpilres and libraries for are also no longer needed - import / export, query selectors, drag and drop, asset bundling etc all could theoretically be dispensed with, with fairly minimal consequences.

The best approach would probably be to utilize some dependencies for core tasks, things like utility functions / state management seem to be required in any SPA. And we could utilize bundlers / transpilers on the deployment stage, and leave development to be instant with raw js files.
