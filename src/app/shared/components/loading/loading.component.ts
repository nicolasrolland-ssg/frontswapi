import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({ selector: 'app-loading', template: '<div class="loading" role="status"><span></span><span></span><span></span><p>INTERROGATION DES ARCHIVES...</p></div>', styles: ['.loading{text-align:center;padding:5rem 1rem;color:var(--cyan);font:600 .65rem var(--font-display);letter-spacing:.12em}.loading span{display:inline-block;width:8px;height:8px;margin:.25rem;background:var(--cyan);box-shadow:0 0 12px var(--cyan);animation:pulse 1s infinite}.loading span:nth-child(2){animation-delay:.2s}.loading span:nth-child(3){animation-delay:.4s}@keyframes pulse{50%{opacity:.2;transform:translateY(-6px)}}'], changeDetection: ChangeDetectionStrategy.OnPush })
export class LoadingComponent {}
