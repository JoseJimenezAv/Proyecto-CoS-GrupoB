import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacioModal } from './espacio-modal';

describe('EspacioModal', () => {
  let component: EspacioModal;
  let fixture: ComponentFixture<EspacioModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspacioModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EspacioModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
