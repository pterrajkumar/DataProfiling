import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { PickListModule } from 'primeng/primeng';
import { FieldServiceService } from "../service/field-service.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-field-to-profile',
  templateUrl: './field-to-profile.component.html',
  styleUrls: ['field-to-profile.component.css']
})
export class FieldToProfileComponent implements OnInit {

  fieldToProfileForm: FormGroup;
  sourceFields: any[];
  targetFields: any[];
  errorMessage: string;
  constructor(private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    public fieldService: FieldServiceService) { 
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.fieldToProfileForm = this.fb.group({
      sFields: [],
      tfields: []
    });
    this.sourceFields = [];//initialize list 1
    this.targetFields = [];//initialize list 2
    this.getAllFields();
    this.getFieldsToProfile();
  }

  moveToTarget(items) {
    //console.log(items);
    this.fieldToProfileForm.setValue({ sFields: this.sourceFields, tfields: this.targetFields });
    //console.log(this.fieldToProfileForm.value);
  }
  getAllFields() {
    /* this.fieldService.getAllFields("PROFILE", "1")
      .subscribe(
      data => {this.sourceFields = data; this.sourceFields = this.sourceFields.filter(item => this.targetFields.indexOf(item) < 0) },
      (error: any) => this.errorMessage = <any>error
      ); */
    //console.log(this.sourceFields);
  }
  getFieldsToProfile() {
    this.fieldService.getFieldsToProfile("PROFILE", "1")
      .subscribe(
      data => { this.targetFields = data; this.sourceFields = this.sourceFields.filter(item => data.indexOf(item) < 0) },
      (error: any) => this.errorMessage = <any>error
      );
    //console.log(this.sourceFields);
  }
  setSelectedColumns() {
    this.fieldService.setFieldsToProfile(this.fieldToProfileForm.value.tfields, "PROFILE", "1")
      .subscribe(
      () => this.onSaveComplete(),
      (error: any) => {this.errorMessage = <any>error;console.log(this.errorMessage);}
      );
  }
  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.toastr.success('Successfuly saved the data!', 'Success!');
  }
}
