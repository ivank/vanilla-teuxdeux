import { Component, updateList } from './component.js';
import { addNamedList, changeNamedListIndex } from './app.js';
import { TodoListComponent } from './todo-list.component.js';

const template = /* html */ `
  <div>
    <slot></slot>
  </div>
  <button type="button" id="add-list">Add List</button>
  <button type="button" id="prev">Prev</button>
  <button type="button" id="next">Next</button>
`;

export class NamedListsComponent extends Component {
  update(prevState, nextState) {
    const prevIds = prevState?.namedLists?.items.slice(prevState.namedLists.index);
    const nextIds = nextState.namedLists.items.slice(nextState.namedLists.index);

    updateList({
      element: this,
      prevIds,
      nextIds,
      add: (id) => new TodoListComponent(id, nextState),
      update: (item) => item.update(prevState, nextState),
    });
  }

  constructor(state) {
    super({ id: 'named-lists', template, state });
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#add-list').addEventListener('click', () => {
      this.dispatch(addNamedList());
    });
    this.shadowRoot.querySelector('#prev').addEventListener('click', () => {
      this.dispatch(changeNamedListIndex(+1));
    });
    this.shadowRoot.querySelector('#next').addEventListener('click', () => {
      this.dispatch(changeNamedListIndex(-1));
    });
  }
}
