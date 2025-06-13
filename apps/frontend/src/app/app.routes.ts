import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/ollama', pathMatch: 'full' },
  {
    path: 'ollama',
    loadComponent: () => import('./ollama/ollama.component').then(m => m.OllamaComponent)
  },
  {
    path: 'ollama-chat',
    loadComponent: () => import('./ollama-chat/ollama-chat.component').then(m => m.OllamaChatComponent)
  },
  {
    path: 'ollama-chat-stream',
    loadComponent: () => import('./ollama-chat-stream/ollama-chat-stream.component').then(m => m.OllamaChatStreamComponent)
  },
  {
    path: 'openai',
    loadComponent: () => import('./openai/openai.component').then(m => m.OpenaiComponent)
  },
  {
    path: 'openai-image',
    loadComponent: () => import('./openai-image/openai-image.component').then(m => m.OpenaiImageComponent)
  },
  {
    path: 'openai-tools',
    loadComponent: () => import('./openai-tools/openai-tools.component').then(m => m.OpenaiToolsComponent)
  },
  {
    path: 'os-model',
    loadComponent: () => import('./os-model/os-model.component').then(m => m.OsModelComponent)
  }
];
