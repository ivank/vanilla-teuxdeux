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
  <div class="day-list">
    <div class="title">Title</div>
    <div class="date">Title</div>
    <div>
      <div class="day-list-items"></div>
      <input type="text" class="day-list-add">
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
    this.querySelector(':scope .title').innerText = titleFormat.format(this.day);
    this.querySelector(':scope .date').innerText = dateFormat.format(this.day);

    const prevIds = toDayItems(prevState, this.day);
    const nextIds = toDayItems(nextState, this.day);

    updateList({
      element: this.querySelector(':scope .day-list-items'),
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
    this.querySelector(':scope .day-list-add').addEventListener('change', (event) => {
      this.dispatch(addDailyTodoItem(this.id, this.day, event.target.value));
      event.target.value = '';
    });
  }
}
