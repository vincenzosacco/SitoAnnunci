import {Component, inject, input, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatListItem} from "@angular/material/list";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AsyncPipe, NgClass} from "@angular/common";
import {AuthFacadeService} from '../../../../services/auth-facade.service';

/**
 * Represents a menu item in the application sidebar or navigation.
 * @property authRequired - Indicates if authentication is required to view this item.
 * @property label - The display label for the menu item.
 * @property icon - icon name for the menu item.
 * @property route - route path for navigation.
 * @property subItems - Optional array of child menu items (for nested menus).
 */
export type MenuItem = {
    authRequired: boolean;
    label: string;
    icon: string;
    route: string;
    subItems?: MenuItem[];
}

@Component({
  selector: 'app-menu-item',
  imports: [
    MatIcon,
    MatListItem,
    RouterLinkActive,
    RouterLink,
    NgClass,
    AsyncPipe
  ],
    templateUrl: './menu-item.component.html',
  standalone: true,
  styleUrl: './menu-item.component.css'
})
export class MenuItemComponent {
    protected authService = inject(AuthFacadeService);

    item = input.required<MenuItem>();

    isOpenSubItems = signal(false);

    toggleSubItems() {
        if (!this.item().subItems) {
            return;
        }

        this.isOpenSubItems.set(!this.isOpenSubItems());
    }

}
