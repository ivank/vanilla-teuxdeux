import { addDailyTodoItem, moveTodoItemToDay } from '../state.js';
import { startOfDay, isSameDay } from '../utils.js';
import { component, updateList, dispatch } from './html.js';
import { dropZone } from './drag-and-drop.js';
import * as todoItem from './todo-item.component.js';

const titleFormat = new Intl.DateTimeFormat(navigator.language, { weekday: 'long' });
const dateFormat = new Intl.DateTimeFormat(navigator.language, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const template = /* html */ `
  <div class="todo-list day-list">
    <h2 data-day-list-title>Title</h2>
    <h3 data-day-list-date>Title</h3>
    <div class="todo-items-container">
      <ol class="day-list-items"></ol>
      <input type="text" class="new-item" data-day-list-new>
    </div>
  </div>
`;

function toDayItems(state, day) {
  return (
    state?.data.dailyLists.items
      .filter((item) => item.day.getDate() === day.getDate())
      .map((item) => item.id) ?? []
  );
}

export function update(prevState, nextState, el) {
  el.classList.toggle('is-past', el.day < startOfDay(new Date()));
  el.classList.toggle('is-today', isSameDay(el.day, new Date()));
  el.querySelector('[data-day-list-title]').innerText = titleFormat.format(el.day);
  el.querySelector('[data-day-list-date]').innerText = dateFormat.format(el.day);

  const prevIds = toDayItems(prevState, el.day);
  const nextIds = toDayItems(nextState, el.day);

  updateList({
    element: el.querySelector('ol'),
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

  dropZone({
    element: el,
    name: 'application/todo-item',
    onDrop: ({ moveId }) => dispatch(moveTodoItemToDay(moveId, el.day), el),
  });

  el.querySelector('[data-day-list-new]').addEventListener('change', (event) => {
    dispatch(addDailyTodoItem(el.day, event.target.value), el);
    event.target.value = '';
  });

  return el;
}
