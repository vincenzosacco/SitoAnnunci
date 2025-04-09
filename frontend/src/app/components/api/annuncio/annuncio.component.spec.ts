import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AnnuncioComponent} from './annuncio.component';

describe('AnnuncioComponent', () => {
  let component: AnnuncioComponent;
  let fixture: ComponentFixture<AnnuncioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnuncioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnuncioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
