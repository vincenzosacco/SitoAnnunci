import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatListItem} from "@angular/material/list";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass} from "@angular/common";
import {of, Subject, switchMap, takeUntil} from "rxjs";
import {AuthGuard} from "../../../../services/auth/auth-guard.service";
import {AuthFacadeService} from "../../../../services/auth/auth-facade.service";

/**
 * Represents a menu item in the application sidebar or navigation.
 * @property label - The display label for the menu item.
 * @property icon - icon name for the menu item.
 * @property route - route path for navigation.
 * @property authRequired - Indicates if authentication is required to view this item.
 * @property roles - Optional array of roles required to view this item.
 * @property subItems - Optional array of child menu items (for nested menus).
 */
export type MenuItem = {
    /** The display label for the menu item. */
    label: string;
    /** Icon name for the menu item, used with MatIcon. */
    icon: string;
    /** Route path for navigation, used with RouterLink. */
    route: string;
    /** Indicates if authentication is required to view this item.
     * This can be used as "visual" authGuard, to hide menu items from users without the required roles.
     * */
    authRequired: boolean;
    /** Optional array of roles required to view this item. If provided, the user must have all roles to view the item.
     * This can be used as "visual" authGuard, to hide menu items from users without the required roles.
     * */
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
export class MenuItemComponent implements OnInit, OnDestroy {
    private authGuard = inject(AuthGuard);
    private auth = inject(AuthFacadeService);

    item = input.required<MenuItem>();
    isOpenSubItems = signal(false);
    canShow = signal(false);

    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        // Reactively check access when user login state OR roles change
        this.auth.isAuthenticated$   // assume your guard or facade exposes an observable
            .pipe(
                switchMap(() => this.item().authRequired ?
                    // If auth is required, check if can access
                    this.authGuard.canAccess$(this.item().route)
                    // else, can show = true
                    : of(true)
                ), // always recheck when auth changes
                takeUntil(this.destroy$)
            )
            .subscribe(result => this.canShow.set(result));

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleSubItems(): void {
        if (!this.item().subItems) {
            return;
        }
        this.isOpenSubItems.update(open => !open);
    }
}
