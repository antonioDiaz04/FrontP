import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesView } from './notificaciones.view';

describe('NotificacionesView', () => {
  let component: NotificacionesView;
  let fixture: ComponentFixture<NotificacionesView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificacionesView]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificacionesView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
