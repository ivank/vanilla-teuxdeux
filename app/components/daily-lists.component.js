import { changeDailyListsCurrentDay } from '../state.js';
import { Component, updateList } from './component.js';
import { DayListComponent } from './day-list.component.js';

function toDateRange(from, days = 7) {
  return Array.from(Array(days).keys()).map((day) => {
    const currentDay = new Date(from);
    currentDay.setDate(currentDay.getDate() + day);
    return currentDay;
  });
}

const template = /* html */ `
<div class="content">
  <div class="left-ui">
    <button type="button" id="back">Back</button>
  </div>
  <div class="items"></div>
  <div class="right-ui">
    <button type="button" id="forward">Forwad</button>
  </div>
</div>
`;

function toDailyLists(state, days = 7) {
  return state
    ? toDateRange(state.dailyLists.currentDay, days).map((day) => ({
        id: `day-${day.getDate()}`,
        day,
      }))
    : [];
}

export class DailyListsComponent extends Component {
  update(prevState, nextState) {
    const prevLists = toDailyLists(prevState);
    const nextLists = toDailyLists(nextState);

    updateList({
      element: this.querySelector(':scope > .content > .items'),
      prevIds: prevLists.map((item) => item.id),
      nextIds: nextLists.map((item) => item.id),
      add: (id) =>
        new DayListComponent(id, nextLists.find((item) => item.id === id).day, nextState),
      update: (item) => item.update(prevState, nextState),
    });
  }

  constructor(state) {
    super({ id: 'daily-lists', template, state });
  }

  connectedCallback() {
    this.querySelector(':scope .left-ui button').addEventListener('click', () => {
      this.dispatch(changeDailyListsCurrentDay(-1));
    });

    this.querySelector(':scope .right-ui button').addEventListener('click', () => {
      this.dispatch(changeDailyListsCurrentDay(+1));
    });
  }
}
