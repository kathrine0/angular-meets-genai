import { Component, computed, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MdViewerComponent } from './md-viewer.component';

export interface Conversation {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MdViewerComponent
  ],
})
export class ChatComponent {
  messagesContainer = viewChild<ElementRef<HTMLElement>>('messagesContainer');

  conversation = input.required<Conversation[]>();
  prompt = output<string>();

  filteredConversation = computed(() => this.conversation().filter((message) => message.role === 'user' || message.role === 'assistant'));

  constructor() {
    effect(() => {
      this.conversation();
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  private scrollToBottom(): void {
    const element = this.messagesContainer()?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
