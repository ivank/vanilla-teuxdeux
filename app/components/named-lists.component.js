import { Component, updateList } from './component.js';
import { addNamedList, changeNamedListIndex } from '../state.js';
import { TodoListComponent } from './todo-list.component.js';

const template = /* html */ `
  <div class="header">
    <button type="button">Add List</button>
  </div>
  <div class="content">
    <div class="left-ui">
      <button type="button">Prev</button>
    </div>
    <div class="items"></div>
    <div class="right-ui">
      <button type="button">Next</button>
    </div>
  </div>
`;

export class NamedListsComponent extends Component {
  update(prevState, nextState) {
    const prevIds = prevState?.namedLists?.items.slice(prevState.namedLists.index);
    const nextIds = nextState.namedLists.items.slice(nextState.namedLists.index);

    updateList({
      element: this.querySelector(':scope > .content > .items'),
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
    this.querySelector(':scope > .header > button').addEventListener('click', () => {
      this.dispatch(addNamedList());
    });
    this.querySelector(':scope .left-ui button').addEventListener('click', () => {
      this.dispatch(changeNamedListIndex(+1));
    });
    this.querySelector(':scope .right-ui button').addEventListener('click', () => {
      this.dispatch(changeNamedListIndex(-1));
    });
  }
}
