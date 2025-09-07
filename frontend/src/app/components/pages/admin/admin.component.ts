// admin.component.ts
import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {AuthFacadeService} from "../../../services/auth/auth-facade.service";

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule],
    template: `
    <h2 *ngIf="(auth.isAuthenticated$ | async)">Admin Panel</h2>
    <button (click)="loadData()">Load Admin Data</button>
  `
})
export class AdminComponent {
    auth = inject(AuthFacadeService);
    http = inject(HttpClient);

    loadData() {
        this.http.get('http://localhost:8080/admin').subscribe(data => {
            console.log('Admin data:', data);
        });
    }
}
