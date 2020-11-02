import { addDailyTodoItem } from '../state.js';
import { Component, updateList } from './component.js';
import { TodoListItemComponent } from './todo-list-item.component.js';

const titleFormat = new Intl.DateTimeFormat(navigator.language, { weekday: 'long' });
const dateFormat = new Intl.DateTimeFormat(navigator.language, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const template = /* html */ `
  <style>
    :host {
      flex-basis: 14.2857142857%;
      height: 400px;
    }
    .list {
      padding: 10px;
    }
    .title {
      font: 30px bold Helvetica, sans-serif;
      text-align: center;
      text-transform: uppercase;
    }
    .date {
      text-align: center;
      margin-bottom: 20px;
    }
    input {
      width: 100%;
    }
  </style>
  <div class="list">
    <div class="title" id="title">Title</div>
    <div class="date" id="date">Title</div>
    <div>
      <slot></slot>
      <input id="new">
    </div>
  </div>
`;

function toDayItems(state, day) {
  return (
    state?.dailyLists.items
      .filter((item) => item.day.getDate() === day.getDate())
      .map((item) => item.id) ?? []
  );
}

export class DayListComponent extends Component {
  get day() {
    return this._day;
  }

  update(prevState, nextState) {
    this.shadowRoot.querySelector('#title').innerText = titleFormat.format(this.day);
    this.shadowRoot.querySelector('#date').innerText = dateFormat.format(this.day);

    const prevIds = toDayItems(prevState, this.day);
    const nextIds = toDayItems(nextState, this.day);

    updateList({
      element: this,
      prevIds,
      nextIds,
      add: (id) => new TodoListItemComponent(id, nextState),
      update: (item) => item.update(prevState, nextState),
    });
  }

  constructor(id, day, state) {
    super({ id, template });
    this._day = day;
    this.update(undefined, state);
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#new').addEventListener('change', (event) => {
      this.dispatch(addDailyTodoItem(this.id, this.day, event.target.value));
      event.target.value = '';
    });
  }
}
