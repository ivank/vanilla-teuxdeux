import { NamedListsComponent } from './named-lists.component.js';
import { DailyListsComponent } from './daily-lists.component.js';
import { reducer, initialState } from '../state.js';

export class AppContainerElement extends HTMLElement {
  set state(state) {
    this.querySelector('named-lists').update(this._state, state);
    this.querySelector('daily-lists').update(this._state, state);
    this._state = state;
  }

  get state() {
    return this._state;
  }

  constructor() {
    super();
    this._state = initialState;
    this.appendChild(new DailyListsComponent(this._state));
    this.appendChild(new NamedListsComponent(this._state));
  }

  connectedCallback() {
    this.addEventListener('action', (event) => {
      this.state = reducer(this.state, event.detail);
      console.log(event.detail, this.state);
    });
  }
}
