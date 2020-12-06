import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetingComponent } from './competing.component';

describe('CompetingComponent', () => {
  let component: CompetingComponent;
  let fixture: ComponentFixture<CompetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
