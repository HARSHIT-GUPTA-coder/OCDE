import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissiontableComponent } from './submissiontable.component';

describe('SubmissiontableComponent', () => {
  let component: SubmissiontableComponent;
  let fixture: ComponentFixture<SubmissiontableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissiontableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissiontableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
