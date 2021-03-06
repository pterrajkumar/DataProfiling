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
import { FileUploadModule, InputTextModule, DataTableModule, ButtonModule, DialogModule, RadioButtonModule, TooltipModule, PickListModule, DataListModule, CheckboxModule, ConfirmDialogModule, TabViewModule, ListboxModule } from 'primeng/primeng';
import { ContentComponent } from './content/content.component';
import { ProfileComponent } from './profile/profile.component';
import { GrowlModule } from 'primeng/components/growl/growl';
import { ProfileServiceService } from './service/profile-service.service';
import { FieldServiceService } from './service/field-service.service';
import { RuleServiceService } from './service/rule-service.service';
import { FieldToProfileServiceService } from './service/field-to-profile-service.service';
import { EntitiesModule } from './entities/entities.module';
import { Configuration } from './app.constants';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ContentComponent,
    ProfileComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    ToastModule.forRoot(),
    FileUploadModule, InputTextModule, DataTableModule, ButtonModule, DialogModule, GrowlModule, RadioButtonModule, TooltipModule, PickListModule, DataListModule, CheckboxModule,
    ConfirmDialogModule, TabViewModule, ListboxModule,
    EntitiesModule
  ],
  providers: [
    { provide: ToastOptions, useClass: CustomOption },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ProfileServiceService, RuleServiceService, FieldServiceService, FieldToProfileServiceService, Configuration
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
