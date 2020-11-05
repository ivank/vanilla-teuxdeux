import { addDailyTodoItem, moveTodoItemToDay } from '../state.js';
import { component, updateList, dispatch } from './component.js';
import * as todoItem from './todo-item.component.js';

const titleFormat = new Intl.DateTimeFormat(navigator.language, { weekday: 'long' });
const dateFormat = new Intl.DateTimeFormat(navigator.language, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const template = /* html */ `
  <div class="todo-list day-list">
    <div class="title" data-day-list-title>Title</div>
    <div class="date" data-day-list-date>Title</div>
    <div class="todo-items-container">
      <ol class="day-list-items"></ol>
      <input type="text" class="new-item" data-day-list-new>
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

export function update(prevState, nextState, el) {
  el.querySelector(':scope [data-day-list-title]').innerText = titleFormat.format(el.day);
  el.querySelector(':scope [data-day-list-date]').innerText = dateFormat.format(el.day);

  const prevIds = toDayItems(prevState, el.day);
  const nextIds = toDayItems(nextState, el.day);

  updateList({
    element: el.querySelector(':scope ol'),
    prevIds,
    nextIds,
    add: (id) => todoItem.create(id, nextState),
    update: (item) => todoItem.update(prevState, nextState, item),
  });
  return el;
}

export function create(id, day, state) {
  const el = component(id, template);
  el.day = day;
  update(undefined, state, el);

  el.querySelector(':scope [data-day-list-new]').addEventListener('change', (event) => {
    dispatch(addDailyTodoItem(el.day, event.target.value), el);
    event.target.value = '';
  });

  /**
   * Drag items from different lists / days
   */

  el.addEventListener('drop', (event) => {
    dispatch(moveTodoItemToDay(event.dataTransfer.getData('application/todo-id'), el.day), el);
    event.preventDefault();
  });

  el.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  return el;
}
