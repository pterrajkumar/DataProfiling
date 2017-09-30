import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntitiesComponent } from './entities.component';
import { DatatypeMetadataComponent } from '../datatype-metadata/datatype-metadata.component';
import { RulesComponent } from '../rules/rules.component';
import { StandardrulesComponent } from '../standardrules/standardrules.component';

const routes: Routes = [
  {
    path: 'entities',
    component: EntitiesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'datatypemetadata' },
      { path: 'datatypemetadata', component: DatatypeMetadataComponent },
      { path: 'datatypemetadata/:id', component: DatatypeMetadataComponent },
      { path: 'standardrule', component: StandardrulesComponent },
      { path: 'standardrule/:id', component: StandardrulesComponent },
      { path: 'rules', component: RulesComponent },
      { path: 'rules/:id', component: RulesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitiesRoutingModule { }

export const routedComponents = [
  EntitiesComponent,
  DatatypeMetadataComponent,
  RulesComponent,
  StandardrulesComponent
];
