import {Component, Input} from '@angular/core';
import {HeaderComponent} from "./header/header.component";
import {MatToolbar} from "@angular/material/toolbar";
import {APP_TITLE} from "../../app.constants";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {SidemenuContentComponent} from "./sidemenu-content/sidemenu-content.component";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-common',
  imports: [
    HeaderComponent,
    MatToolbar,
    MatSidenavContainer,
    MatSidenavContent,
    MatSidenav,
    SidemenuContentComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './common.component.html',
  styleUrl: './common.component.css',
})
export class CommonComponent {
  protected readonly APP_TITLE = APP_TITLE;

  @Input() pageContent!: any;


}
