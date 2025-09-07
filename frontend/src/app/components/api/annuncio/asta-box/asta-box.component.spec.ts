import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstaBoxComponent } from './asta-box.component';

describe('AstaBoxComponent', () => {
  let component: AstaBoxComponent;
  let fixture: ComponentFixture<AstaBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AstaBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstaBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
