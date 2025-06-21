import {Component, inject, OnInit} from '@angular/core';
import {AuthService, User} from '@auth0/auth0-angular';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  imports: [],
  standalone: true
})
export class UserProfileComponent implements OnInit {
  private router = inject(Router);
  user: User | null | undefined;
  private userSub?: Subscription; // best practice to unsubscribe from subscriptions to avoid memory leaks.
  constructor(protected auth: AuthService) {}

  // AuthGuard service itself protects this component by being used when User is not authenticated (or not available
  // for some other reason).
  // I add another layer of protection using the 'user' properties, which is checked and set in the `ngOnInit` and
  // called HTML template. In this way, I ensure that the user profile is only accessed when the user is authenticated.


  ngOnInit(): void {
    this.userSub = this.auth.user$.subscribe(
      (user: User | null | undefined) => {
        if (user) {
          this.user = user;
        } else {
          console.error('User not found. The page "user-profile" should not be accessible without authentication. ' +
            "\nThe AuthGuard isn't working as expected. Redirecting to 'no-auth-redirect' page...");
          this.router.navigate(['/no-auth-redirect']);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe(); // Unsubscribe to prevent memory leaks
  }
}

