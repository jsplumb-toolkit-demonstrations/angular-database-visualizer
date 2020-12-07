import { RouterModule, Routes } from '@angular/router';
import { DatasetComponent } from "./dataset";
import { DatabaseVisualizerComponent } from "./database-visualizer";

export const AppRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DatabaseVisualizerComponent },
  { path: 'data', component: DatasetComponent }
];

export const ROUTING = RouterModule.forRoot(AppRoutes, {useHash: true});
