import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalPlaylistPage } from './local-playlist.page';

describe('LocalPlaylistPage', () => {
  let component: LocalPlaylistPage;
  let fixture: ComponentFixture<LocalPlaylistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalPlaylistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
