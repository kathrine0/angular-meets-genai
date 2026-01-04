import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  navigationItems = [
    { path: '/ollama', label: 'Ollama' },
    { path: '/ollama-chat', label: 'Ollama Chat' },
    { path: '/ollama-chat-stream', label: 'Streaming' },
    { path: '/openai', label: 'OpenAI' },
    { path: '/openai-image', label: 'Image' },
    { path: '/openai-tools', label: 'Tools' },
    { path: '/code-gen', label: 'CodeGen' },
    { path: '/hashbrown', label: 'Hashbrown' },
  ];
}
