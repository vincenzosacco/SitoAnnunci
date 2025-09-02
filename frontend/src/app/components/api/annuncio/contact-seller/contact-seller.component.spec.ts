import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactSellerComponent} from './contact-seller.component';

describe('ContactSellerComponent', () => {
  let component: ContactSellerComponent;
  let fixture: ComponentFixture<ContactSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
