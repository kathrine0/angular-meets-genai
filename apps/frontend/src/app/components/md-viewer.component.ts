import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { Remarkable } from 'remarkable';

@Component({
  selector: 'app-md-viewer',
  imports: [CommonModule],
  template: ` <div [innerHTML]="content()"></div> `,
  styles: [
    `
      div {
        margin-block: -1em; /* neutralize p margin */
      }
    `,
  ],
})
export class MdViewerComponent {
  private readonly remarkable = new Remarkable();

  mdContent = viewChild.required<ElementRef>('mdcontent');
  md = input.required<string>();

  content = computed(() => this.remarkable.render(this.md()));
}
