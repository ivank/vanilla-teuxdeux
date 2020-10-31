import { NamedListsElement } from './named-lists.js';
import { TodoListElement } from './todo-list.js';
import { TodoListItemElement } from './todo-list-item.js';
import { DailyListElement } from './daily-list.js';
import { WeekListsElement } from './week-lists.js';

customElements.define('named-lists', NamedListsElement);
customElements.define('week-lists', WeekListsElement);
customElements.define('daily-list', DailyListElement);
customElements.define('todo-list', TodoListElement);
customElements.define('todo-list-item', TodoListItemElement);
