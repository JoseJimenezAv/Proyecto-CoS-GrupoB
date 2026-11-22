import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaciosList } from './espacios-list';

describe('EspaciosList', () => {
  let component: EspaciosList;
  let fixture: ComponentFixture<EspaciosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspaciosList],
    }).compileComponents();

    fixture = TestBed.createComponent(EspaciosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
