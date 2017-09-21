import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntitiesRoutingModule, routedComponents } from './entities-routing.module';
/* PRIMENG */
import { FileUploadModule, InputTextModule, DataTableModule, ButtonModule, DialogModule, RadioButtonModule, TooltipModule,PickListModule,DropdownModule,DataListModule, CheckboxModule, ConfirmDialogModule, TabViewModule, ListboxModule } from 'primeng/primeng';
import { ToastOptions } from "ng2-toastr/ng2-toastr";
import { CustomOption } from "../shared/custom-option";
import { ProfileServiceService } from "../service/profile-service.service";
import { RuleServiceService } from "../service/rule-service.service";
import { FieldServiceService } from "../service/field-service.service";

@NgModule({
  imports: [
    CommonModule,
    EntitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule, InputTextModule, DataTableModule, ButtonModule, DialogModule, RadioButtonModule, TooltipModule, PickListModule, DropdownModule, DataListModule, CheckboxModule,
    ConfirmDialogModule, TabViewModule, ListboxModule,
  ],
  declarations: [routedComponents],
  providers: [
    { provide: ToastOptions, useClass: CustomOption },
    ProfileServiceService, RuleServiceService, FieldServiceService
  ],
})
export class EntitiesModule { }
