import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/ollama', pathMatch: 'full' },
  {
    path: 'ollama',
    loadComponent: () => import('./1-ollama/ollama.component').then(m => m.OllamaComponent)
  },
  {
    path: 'ollama-chat-stream',
    loadComponent: () => import('./2-ollama-chat-stream/ollama-chat-stream.component').then(m => m.OllamaChatStreamComponent)
  },
  {
    path: 'openai',
    loadComponent: () => import('./3-openai/openai.component').then(m => m.OpenaiComponent)
  },
  {
    path: 'openai-image',
    loadComponent: () => import('./3.1-openai-image/openai-image.component').then(m => m.OpenaiImageComponent)
  },
  {
    path: 'openai-tools',
    loadComponent: () => import('./4-openai-tools/openai-tools.component').then(m => m.OpenaiToolsComponent)
  },
  {
    path: 'code-gen',
    loadComponent: () => import('./5-code-gen/code-gen.component').then(m => m.CodeGenComponent)
  },
  {
    path: 'hashbrown',
    loadComponent: () => import('./5.1-hashbrown/hashbrown.component').then(m => m.HashbrownComponent)
  },
];
