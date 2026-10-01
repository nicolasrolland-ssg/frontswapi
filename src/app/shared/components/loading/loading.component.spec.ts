import { TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => { it('creates an accessible loading status', () => { const fixture = TestBed.createComponent(LoadingComponent); fixture.detectChanges(); expect(fixture.nativeElement.querySelector('[role="status"]')).toBeTruthy(); }); });
