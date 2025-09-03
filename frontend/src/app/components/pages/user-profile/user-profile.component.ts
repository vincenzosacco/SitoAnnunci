import {Component, inject} from '@angular/core';
import {AuthFacadeService} from "../../../services/auth/auth-facade.service";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    imports: [
        AsyncPipe
    ],
    standalone: true
})

export class UserProfileComponent {
    protected user$ =  inject(AuthFacadeService).user$;
}

