import {Component, signal} from '@angular/core';
import {MatNavList} from "@angular/material/list";
import {MenuItem, MenuItemComponent} from "../menu-item/menu-item.component";


@Component({
    selector: 'app-sidemenu-content',
    imports: [
        MatNavList,
        MenuItemComponent,
    ],
    template:`
      <mat-nav-list>
        @for (item of menuItems(); track item.label){
          <app-menu-item [item]="item"> </app-menu-item>
        }
      </mat-nav-list>
    `,
    standalone: true,
    styleUrl: './sidemenu-content.component.css'
})

export class SidemenuContentComponent {
    constructor() {
    }


    menuItems = signal<MenuItem[]>(
        [
            {
                label: 'Home',
                authRequired: false,
                icon: 'home',
                route: '/home',
            },
            {
                label: 'Dashboard',
                authRequired: false,
                icon: 'dashboard',
                route: '/dashboard',
            },
            {
                label: 'Profile',
                authRequired: true,
                icon: 'account_circle',
                route:'/user-profile',
            },

            {
                label: 'Chat',
                authRequired: true,
                icon: 'chat',
                route: '/chat', //
            },

            {
                label: 'Settings',
                authRequired: false,
                icon: 'settings',
                route: '/settings',
            },

            {
                label: 'Admin',
                authRequired: true,
                icon: 'admin_panel_settings',
                route: '/admin',
            }
        ]
    );

}


/////////////////////
