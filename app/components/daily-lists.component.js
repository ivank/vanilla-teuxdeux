import { changeDailyListsCurrentDay } from '../state.js';
import { component, dispatch, updateList } from './component.js';
import * as dayList from './day-list.component.js';

const template = /* html */ `
  <div class="daily-lists">
    <div class="content">
      <div class="left-ui">
        <button type="button" data-daily-lists-back>&lsaquo;</button>
      </div>
      <div class="items" data-daily-lists-items></div>
      <div class="right-ui">
        <button type="button" data-daily-lists-forward>&rsaquo;</button>
      </div>
    </div>
  </div>
`;

function toDateRange(from, days = 7) {
  return Array.from(Array(days).keys()).map((day) => {
    const currentDay = new Date(from);
    currentDay.setDate(currentDay.getDate() + day);
    return currentDay;
  });
}

function toDailyLists(state, days = 7) {
  return state
    ? toDateRange(state.dailyLists.currentDay, days).map((day) => ({
        id: `day-${day.getDate()}`,
        day,
      }))
    : [];
}

export function update(prevState, nextState, el) {
  const prevLists = toDailyLists(prevState);
  const nextLists = toDailyLists(nextState);

  updateList({
    element: el.querySelector(':scope [data-daily-lists-items]'),
    prevIds: prevLists.map((item) => item.id),
    nextIds: nextLists.map((item) => item.id),
    add: (id) => dayList.create(id, nextLists.find((item) => item.id === id).day, nextState),
    update: (item) => dayList.update(prevState, nextState, item),
  });
  return el;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  el.querySelector(':scope [data-daily-lists-back]').addEventListener('click', () => {
    dispatch(changeDailyListsCurrentDay(-1), el);
  });
  el.querySelector(':scope [data-daily-lists-forward]').addEventListener('click', () => {
    dispatch(changeDailyListsCurrentDay(+1), el);
  });
  return el;
}
