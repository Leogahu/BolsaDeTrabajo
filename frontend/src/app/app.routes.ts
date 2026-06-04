import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/public/landing/landing').then(m => m.Landing) },
  { path: 'login', loadComponent: () => import('./features/public/login/login').then(m => m.LoginComponent) },
  { path: 'candidato/register', loadComponent: () => import('./features/candidato/register/register').then(m => m.Register) },
  { path: 'reclutador/register', loadComponent: () => import('./features/reclutador/register/register').then(m => m.Register) },
  {
    path: 'candidato',
    loadComponent: () => import('./shared/layouts/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [authGuard('postante')],
    data: { panel: 'candidato' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/candidato/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'explorar-vacantes', loadComponent: () => import('./features/candidato/explorar-vacantes/explorar-vacantes').then(m => m.ExplorarVacantes) },
      { path: 'vacante/:id', loadComponent: () => import('./features/candidato/detalle-vacante/detalle-vacante').then(m => m.DetalleVacante) },
      { path: 'postulaciones', loadComponent: () => import('./features/candidato/postulaciones/postulaciones').then(m => m.Postulaciones) },
      { path: 'entrevistas', loadComponent: () => import('./features/candidato/entrevistas/entrevistas').then(m => m.Entrevistas) },
      { path: 'habilidades', loadComponent: () => import('./features/candidato/habilidades/habilidades').then(m => m.Habilidades) },
      { path: 'perfil', loadComponent: () => import('./features/candidato/perfil/perfil').then(m => m.Perfil) },
      { path: 'perfil/editar', loadComponent: () => import('./features/candidato/editar-perfil/editar-perfil').then(m => m.EditarPerfil) },
      { path: 'alertas', loadComponent: () => import('./features/candidato/alertas/alertas').then(m => m.Alertas) },
    ]
  },
  {
    path: 'reclutador',
    loadComponent: () => import('./shared/layouts/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [authGuard('reclutador')],
    data: { panel: 'reclutador' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/reclutador/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'portal-empresa', loadComponent: () => import('./features/reclutador/portal-empresa/portal-empresa').then(m => m.PortalEmpresa) },
      { path: 'publicar-oferta', loadComponent: () => import('./features/reclutador/publicar-oferta/publicar-oferta').then(m => m.PublicarOferta) },
      { path: 'vacantes', loadComponent: () => import('./features/reclutador/vacantes/vacantes').then(m => m.Vacantes) },
      { path: 'gestion-candidatos', loadComponent: () => import('./features/reclutador/gestion-candidatos/gestion-candidatos').then(m => m.GestionCandidatos) },
      { path: 'feedback', loadComponent: () => import('./features/reclutador/feedback/feedback').then(m => m.Feedback) },
      { path: 'reportes', loadComponent: () => import('./features/reclutador/reportes/reportes').then(m => m.Reportes) },
    ]
  },
  { path: '**', redirectTo: '' }
];
