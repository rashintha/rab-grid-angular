import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RabGridAngularComponent } from './rab-grid-angular.component';

describe('RabGridAngularComponent', () => {
  let component: RabGridAngularComponent;
  let fixture: ComponentFixture<RabGridAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RabGridAngularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RabGridAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
