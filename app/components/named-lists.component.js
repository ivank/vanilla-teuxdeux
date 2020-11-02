import { Component, updateList } from './component.js';
import { addNamedList, changeNamedListIndex } from '../state.js';
import { TodoListComponent } from './todo-list.component.js';

const template = /* html */ `
  <style>
    .content {
      display: flex;
    }
    .items {
      flex-grow: 2;
    }
    .left-ui, .right-ui {
      width: 50px;
    }
    slot {
      display: flex;
    }
  </style>
  <div class="header">
    <button type="button" id="add-list">Add List</button>
  </div>
  <div class="content">
    <div class="left-ui">
      <button type="button" id="prev">Prev</button>
    </div>
    <div class="items">
      <slot></slot>
    </div>
    <div class="right-ui">
      <button type="button" id="next">Next</button>
    </div>
  </div>
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
