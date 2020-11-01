import { Component, updateList } from './component.js';
import { TodoListItemComponent } from './todo-list-item.component.js';
import { addTodoItem } from './app.js';

const template = /* html */ `
  <div>
    <span id="title">Title</span>
    <div>
      <slot></slot>
    </div>
    <button type="button" id="add-item">Add</button>
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
    this.shadowRoot.querySelector('#add-item').addEventListener('click', () => {
      this.dispatch(addTodoItem(this.id));
    });
  }
}
