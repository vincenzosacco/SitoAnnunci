import {Component, input, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatListItem} from "@angular/material/list";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass} from "@angular/common";

export type MenuItem = {
    label: string;
    icon?: string;
    route?: string;
    subItems?: MenuItem[];
}

@Component({
  selector: 'app-menu-item',
    imports: [
        MatIcon,
        MatListItem,
        RouterLinkActive,
        RouterLink,
        NgClass
    ],
    templateUrl: './menu-item.component.html',
  standalone: true,
  styleUrl: './menu-item.component.css'
})


export class MenuItemComponent {
    item = input.required<MenuItem>();

    isOpenSubItems = signal(false);

    toggleSubItems() {
        if (!this.item().subItems) {
            return;
        }

        this.isOpenSubItems.set(!this.isOpenSubItems());
    }

}
