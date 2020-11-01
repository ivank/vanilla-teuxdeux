import { NamedListsComponent } from './named-lists.component.js';
import { toReduceer, initialState } from './app.js';

export class AppContainerElement extends HTMLElement {
  set state(state) {
    this.querySelector('named-lists').update(this._state, state);
    this._state = state;
  }

  get state() {
    return this._state;
  }

  constructor() {
    super();
    this._state = initialState;
    this.appendChild(new NamedListsComponent(this._state));
  }

  connectedCallback() {
    this.addEventListener('action', (event) => {
      console.log(event.detail, this.state);
      this.state = toReduceer(event.detail)(this.state);
    });
  }
}
