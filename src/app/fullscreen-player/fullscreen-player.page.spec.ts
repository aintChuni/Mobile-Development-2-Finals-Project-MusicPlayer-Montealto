import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullscreenPlayerPage } from './fullscreen-player.page';

describe('FullscreenPlayerPage', () => {
  let component: FullscreenPlayerPage;
  let fixture: ComponentFixture<FullscreenPlayerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
