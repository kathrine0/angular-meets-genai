
import {
  Component,
  computed,
  ElementRef,
  input,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Remarkable } from 'remarkable';

@Component({
  selector: 'app-md-viewer',
  imports: [],
  template: ` <div [innerHTML]="content()"></div> `,
  styles: [
    `
      div {
        margin-block: -1em; /* neutralize p margin */
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdViewerComponent {
  private readonly remarkable = new Remarkable();

  mdContent = viewChild.required<ElementRef>('mdcontent');
  md = input.required<string>();

  content = computed(() => this.remarkable.render(this.md()));
}
