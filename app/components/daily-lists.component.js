import { changeDailyListsCurrentDay } from '../state.js';
import { changeDay, diffDays } from '../utils.js';
import { component, dispatch, updateList } from './component.js';
import * as dayList from './day-list.component.js';

const template = /* html */ `
  <div class="todo-lists daily-lists">
    <div class="content">
      <div class="left-ui">
        <button type="button" class="btn" data-daily-lists-back>&lsaquo;</button>
        <button type="button" class="btn" data-daily-lists-back-week>&laquo;</button>
      </div>
      <div class="items-container">
        <div class="items" data-daily-lists-items>
      </div>
      </div>
      <div class="right-ui">
        <button type="button" class="btn" data-daily-lists-forward>&rsaquo;</button>
        <button type="button" class="btn" data-daily-lists-forward-week>&raquo;</button>
      </div>
    </div>
  </div>
`;

function toDateRange(from, days) {
  return Array.from(Array(days).keys()).map((day) => changeDay(day, from));
}

function toDailyLists(state, days = 21) {
  return state
    ? toDateRange(changeDay(-7, state.dailyLists.currentDay), days).map((day) => ({
        id: `day-${day.getDate()}`,
        day,
      }))
    : [];
}

export function update(prevState, nextState, el) {
  const items = el.querySelector(':scope [data-daily-lists-items]');
  const diff = prevState
    ? diffDays(prevState.dailyLists.currentDay, nextState.dailyLists.currentDay)
    : undefined;

  if (diff) {
    el.diff = (el.diff ?? 0) + diff;
    items.style.marginLeft = `calc((-100% / 7) * (${7 + el.diff}))`;
    setTimeout(() => {
      items.classList.add('is-animating');
      el.diff = el.diff - diff;
      items.style.marginLeft = `calc((-100% / 7) * (${7 + el.diff}))`;
    });
    setTimeout(() => {
      if (el.diff === 0) {
        items.classList.remove('is-animating');
      }
    }, 200);
  }

  const prevLists = toDailyLists(prevState);
  const nextLists = toDailyLists(nextState);

  updateList({
    element: items,
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
  el.querySelector(':scope [data-daily-lists-back-week]').addEventListener('click', () => {
    dispatch(changeDailyListsCurrentDay(-7), el);
  });
  el.querySelector(':scope [data-daily-lists-forward-week]').addEventListener('click', () => {
    dispatch(changeDailyListsCurrentDay(+7), el);
  });
  return el;
}
