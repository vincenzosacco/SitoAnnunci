import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SidemenuContentComponent} from './sidemenu-content.component';

describe('SidenavComponent', () => {
  let component: SidemenuContentComponent;
  let fixture: ComponentFixture<SidemenuContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidemenuContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidemenuContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
