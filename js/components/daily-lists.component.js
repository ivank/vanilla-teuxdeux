import { changeDailyListsCurrentDay } from '../state.js';
import { addDays, diffDays, toISODate } from '../utils.js';
import { component, dispatch, updateList } from './html.js';
import * as dayList from './day-list.component.js';

const template = /* html */ `
  <div class="todo-lists daily-lists">
    <div class="left-ui">
      <button type="button" class="btn light" data-daily-lists-back title="Move 1 day back">
        &lsaquo;
      </button>
      <button type="button" class="btn light" data-daily-lists-back-week title="Move 5 day back">
        &laquo;
      </button>
    </div>
    <div class="items-container">
      <div class="items" data-daily-lists-items>
    </div>
    </div>
    <div class="right-ui">
      <button type="button" class="btn light" data-daily-lists-forward title="Move 1 day forward">
        &rsaquo;
      </button>
      <button type="button" class="btn light" data-daily-lists-forward-week title="Move 1 day forward">
          &raquo;
      </button>
    </div>
  </div>
`;

function toDateRange(from, days) {
  return Array.from(Array(days).keys()).map((day) => addDays(day, from));
}

function toDailyLists(state, days = 15) {
  return state
    ? toDateRange(addDays(-5, state.data.dailyLists.currentDay), days).map((day) => ({
        id: `day-${toISODate(day)}`,
        day,
      }))
    : [];
}

export function update(prevState, nextState, el) {
  const items = el.querySelector('[data-daily-lists-items]');
  const diff = prevState
    ? diffDays(prevState.data.dailyLists.currentDay, nextState.data.dailyLists.currentDay)
    : undefined;

  if (diff) {
    el.diff = (el.diff ?? 0) + diff;
    items.style.marginLeft = `calc((-100% / 5) * (${5 + el.diff}))`;
    setTimeout(() => {
      items.classList.add('is-animating');
      el.diff = el.diff - diff;
      items.style.marginLeft = `calc((-100% / 5) * (${5 + el.diff}))`;
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

  el.querySelector('[data-daily-lists-back]').addEventListener('click', () => {
    dispatch(changeDailyListsCurrentDay(-1), el);
  });
  el.querySelector('[data-daily-lists-forward]').addEventListener('click', () => {
    dispatch(changeDailyListsCurrentDay(+1), el);
  });
  el.querySelector('[data-daily-lists-back-week]').addEventListener('click', () => {
    dispatch(changeDailyListsCurrentDay(-5), el);
  });
  el.querySelector('[data-daily-lists-forward-week]').addEventListener('click', () => {
    dispatch(changeDailyListsCurrentDay(+5), el);
  });
  return el;
}
