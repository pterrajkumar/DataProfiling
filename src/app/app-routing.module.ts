import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { EntityTreeComponent } from "./entity-tree/entity-tree.component";
//import { RulesComponent } from './rules/rules.component';
import { TestComponent } from './test/test.component';
import { MetadataTabComponent } from "./metadata-tab/metadata-tab.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'metadatatab', component: MetadataTabComponent },
  { path: 'entitytree', component: EntityTreeComponent },
  //{ path: 'rules', component: RulesComponent },
  { path: 'test', component:TestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
