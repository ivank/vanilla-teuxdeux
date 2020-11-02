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
  <style>
    :host {
      display: flex;
    }
    .content {
      flex-grow: 2;
    }
    .left-ui, .right-ui {
      width: 50px;
    }
    slot {
      display: flex;
    }
  </style>
  <div class="left-ui">
    <button type="button" id="back">Back</button>
  </div>
  <div class="content">
    <slot></slot>
  </div>
  <div class="right-ui">
    <button type="button" id="forward">Forwad</button>
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
      element: this,
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
    this.shadowRoot.querySelector('#back').addEventListener('click', () => {
      this.dispatch(changeDailyListsCurrentDay(-1));
    });

    this.shadowRoot.querySelector('#forward').addEventListener('click', () => {
      this.dispatch(changeDailyListsCurrentDay(+1));
    });
  }
}
