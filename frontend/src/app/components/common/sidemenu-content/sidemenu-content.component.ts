import {Component, signal} from '@angular/core';
import {MatNavList} from "@angular/material/list";
import {MenuItem, MenuItemComponent} from "../menu-item/menu-item.component";


@Component({
    selector: 'app-sidemenu-content',
    imports: [
        MatNavList,
        MenuItemComponent,
    ],
    templateUrl: './sidemenu-content.component.html',
    standalone: true,
    styleUrl: './sidemenu-content.component.css'
})

export class SidemenuContentComponent {
    constructor() {
    }


    menuItems = signal<MenuItem[]>(
        [
            {
                icon: 'home',
                label: 'Home',
                route: '/home',
            },
            {
                icon: 'dashboard',
                label: 'Dashboard',
                route: '/dashboard',
            },
            {
                icon: 'account_circle',
                label: 'Profile',
                route:'/user-profile',
            },

            {
                icon: 'settings',
                label: 'Settings',
            },
        ]
    );

}


/////////////////////
