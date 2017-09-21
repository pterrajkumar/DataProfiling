import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
/* TOASTR */
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { CustomOption } from './shared/custom-option';
/* PRIMENG */
import { FileUploadModule, InputTextModule, DataTableModule, ButtonModule, DialogModule, RadioButtonModule, TooltipModule,PickListModule,DropdownModule,DataListModule, CheckboxModule, ConfirmDialogModule, TabViewModule, ListboxModule } from 'primeng/primeng';

import { ContentComponent } from './content/content.component';
import { ProfileComponent } from './profile/profile.component';
import { GrowlModule } from 'primeng/components/growl/growl';
import { ProfileServiceService } from './service/profile-service.service';
//import { RulesComponent } from './rules/rules.component';
//import { RuleServiceService } from "./service/rule-service.service";
import { FieldToProfileComponent } from './field-to-profile/field-to-profile.component';
import { FieldServiceService } from "./service/field-service.service";
import { KeyFieldComponent } from './key-field/key-field.component';
import { UniqueIdentifierFieldComponent } from './unique-identifier-field/unique-identifier-field.component';
//import { DatatypeMetadataComponent } from './datatype-metadata/datatype-metadata.component';
import { EntityTreeComponent } from './entity-tree/entity-tree.component';

import { RuleServiceService } from "./service/rule-service.service";
import { TestComponent } from "./test/test.component";
import { FieldToProfileServiceService } from "./service/field-to-profile-service.service";
import { MetadataTabComponent } from './metadata-tab/metadata-tab.component';
import { EntitiesModule } from "./entities/entities.module";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ContentComponent,
    ProfileComponent,
    FieldToProfileComponent,
    KeyFieldComponent,
    UniqueIdentifierFieldComponent,
    //DatatypeMetadataComponent,
    EntityTreeComponent,
    ProfileComponent,
    TestComponent,
    MetadataTabComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    ToastModule.forRoot(),
    FileUploadModule, InputTextModule, DataTableModule, ButtonModule, DialogModule, GrowlModule, RadioButtonModule, TooltipModule, PickListModule, DropdownModule, DataListModule, CheckboxModule,
    ConfirmDialogModule, TabViewModule, ListboxModule,
    EntitiesModule
  ],
  providers: [
    { provide: ToastOptions, useClass: CustomOption },
    ProfileServiceService,RuleServiceService,FieldServiceService,FieldToProfileServiceService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
