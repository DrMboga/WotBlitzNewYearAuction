import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankCardComponent } from './tank-card.component';

describe('TankCardComponent', () => {
  let component: TankCardComponent;
  let fixture: ComponentFixture<TankCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TankCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TankCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
