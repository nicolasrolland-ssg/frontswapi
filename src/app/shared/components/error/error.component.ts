import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
    readonly message = input('Transmission interrompue.');
    readonly code = input(500); 
    readonly retry = output<void>();
}
