import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NoAuthRedirectComponent} from './no-auth-redirect.component';

describe('NoAuthRedirectComponent', () => {
  let component: NoAuthRedirectComponent;
  let fixture: ComponentFixture<NoAuthRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoAuthRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAuthRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
