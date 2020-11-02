import * as namedLists from './named-lists.component.js';
import * as dailyLists from './daily-lists.component.js';
import { reducer, initialState } from '../state.js';

export function update(prevState, nextState, el) {
  namedLists.update(prevState, nextState, el.querySelector('#named-lists'));
  dailyLists.update(prevState, nextState, el.querySelector('#daily-lists'));
}

export function create(el) {
  el.state = initialState;
  el.appendChild(dailyLists.create('daily-lists', el.state));
  el.appendChild(namedLists.create('named-lists', el.state));

  el.addEventListener('action', (event) => {
    const prevState = el.state;
    const nextState = reducer(prevState, event.detail);
    update(prevState, nextState, el);
    el.state = nextState;
    console.log(event.detail, el.state);
  });
}
