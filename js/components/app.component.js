import * as namedLists from './named-lists.component.js';
import * as dailyLists from './daily-lists.component.js';
import * as header from './header.component.js';
import { reducer, initialState, serializeState, deserializeState, init } from '../state.js';
import { dispatch } from './html.js';

export function update(prevState, nextState, el) {
  header.update(prevState, nextState, el.querySelector('#header'));
  namedLists.update(prevState, nextState, el.querySelector('#named-lists'));
  dailyLists.update(prevState, nextState, el.querySelector('#daily-lists'));
}

export function create(el) {
  const loadedState = window.localStorage.getItem('state');
  el.state = loadedState ? deserializeState(loadedState) : initialState;

  el.appendChild(header.create('header', el.state));
  el.appendChild(dailyLists.create('daily-lists', el.state));
  el.appendChild(namedLists.create('named-lists', el.state));

  el.addEventListener('action', (event) => {
    const prevState = el.state;
    const nextState = reducer(event.detail)(prevState);
    update(prevState, nextState, el);
    el.state = nextState;

    window.localStorage.setItem('state', serializeState(el.state));
    console.log(event.detail, el.state);
  });

  dispatch(init(), el);
}
