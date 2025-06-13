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
    { path: '/ollama-chat-stream', label: 'Ollama Chat Stream' },
    { path: '/openai', label: 'OpenAI' },
    { path: '/openai-image', label: 'OpenAI Image' },
    { path: '/openai-tools', label: 'OpenAI Tools' },
    { path: '/os-model', label: 'OS Model' },
  ];
}
