import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureManageComponent } from './feature-manage.component';

describe('FeatureManageComponent', () => {
  let component: FeatureManageComponent;
  let fixture: ComponentFixture<FeatureManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeatureManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
