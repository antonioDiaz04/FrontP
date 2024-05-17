import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPurificadoraComponent } from './adm-purificadora.component';

describe('AdmPurificadoraComponent', () => {
  let component: AdmPurificadoraComponent;
  let fixture: ComponentFixture<AdmPurificadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmPurificadoraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmPurificadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
