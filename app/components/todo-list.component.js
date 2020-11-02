import { Component, updateList } from './component.js';
import { TodoListItemComponent } from './todo-list-item.component.js';
import { addTodoItem } from '../state.js';

const template = /* html */ `
  <style>
    :host {
      flex-basis: 14.2857142857%;
      height: 400px;
    }
    .list {
      padding: 10px;
    }
    input {
      width: 100%;
    }
  </style>
  <div class="list">
    <span id="title">Title</span>
    <div>
      <slot></slot>
      <input id="new">
    </div>
  </div>
`;

export class TodoListComponent extends Component {
  update(prevState, nextState) {
    const prev = prevState?.todoLists?.find((list) => list.id === this._id);
    const next = nextState.todoLists.find((list) => list.id === this._id);

    this.shadowRoot.querySelector('#title').innerText = next.name;

    updateList({
      element: this,
      nextIds: next.items,
      prevIds: prev?.items,
      add: (id) => new TodoListItemComponent(id, nextState),
      update: (item) => item.update(prevState, nextState),
    });
  }

  constructor(id, state) {
    super({ id, state, template });
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#new').addEventListener('change', (event) => {
      this.dispatch(addTodoItem(this.id, event.target.value));
      event.target.value = '';
    });
  }
}
