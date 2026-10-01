import { TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';

describe('ErrorComponent',
    () => {
        it('renders an alert',
            () => {
                const fixture = TestBed.createComponent(ErrorComponent);
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
            });
    });
