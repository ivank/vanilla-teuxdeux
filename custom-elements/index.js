import { AppContainerElement } from './app-container.js';
import { NamedListsComponent } from './named-lists.component.js';
import { TodoListComponent } from './todo-list.component.js';
import { TodoListItemComponent } from './todo-list-item.component.js';
import { DailyListElement } from './daily-list.js';
import { WeekListsElement } from './week-lists.js';

customElements.define('named-lists', NamedListsComponent);
customElements.define('week-lists', WeekListsElement);
customElements.define('daily-list', DailyListElement);
customElements.define('todo-list', TodoListComponent);
customElements.define('todo-list-item', TodoListItemComponent);
customElements.define('app-container', AppContainerElement);
