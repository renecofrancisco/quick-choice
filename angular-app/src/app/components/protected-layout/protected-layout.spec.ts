import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedLayout } from './protected-layout';

describe('ProtectedLayout', () => {
  let component: ProtectedLayout;
  let fixture: ComponentFixture<ProtectedLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtectedLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtectedLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
