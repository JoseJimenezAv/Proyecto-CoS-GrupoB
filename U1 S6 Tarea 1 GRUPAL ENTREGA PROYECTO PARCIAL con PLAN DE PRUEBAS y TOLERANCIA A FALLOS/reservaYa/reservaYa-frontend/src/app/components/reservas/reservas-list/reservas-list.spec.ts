import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasList } from './reservas-list';

describe('ReservasList', () => {
  let component: ReservasList;
  let fixture: ComponentFixture<ReservasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasList],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
