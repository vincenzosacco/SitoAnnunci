import {Component, inject} from '@angular/core';
import {User} from '@auth0/auth0-angular';
import {AuthFacadeService} from "../../../services/auth/auth-facade.service";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    imports: [],
    standalone: true
})
export class UserProfileComponent {
    protected user: User | null | undefined;
    protected auth = inject(AuthFacadeService);
}

