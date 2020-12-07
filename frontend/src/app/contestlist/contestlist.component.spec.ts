import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestlistComponent } from './contestlist.component';

describe('ContestlistComponent', () => {
  let component: ContestlistComponent;
  let fixture: ComponentFixture<ContestlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
