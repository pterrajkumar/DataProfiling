import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import {PickListModule} from 'primeng/primeng';
import { FieldServiceService } from "../service/field-service.service";

@Component({
  selector: 'app-key-field',
  templateUrl: './key-field.component.html',
  styleUrls: ['./key-field.component.css']
})
export class KeyFieldComponent implements OnInit {
  errorMessage: any;

  keyFieldForm: FormGroup;
  sourceFields: any[];
  targetFields: any[];
  constructor(private fb: FormBuilder,
    public fieldService:FieldServiceService) { }

  ngOnInit() {
    this.keyFieldForm = this.fb.group({
      sFields:[],
      tfields:[]
    });
    this.sourceFields = [];
    this.targetFields = [];
    this.getAllFields();
  }
  // getSelectedColumns(){
  //   this.fieldService.setFieldsToProfile(this.targetFields);
  //   return this.targetfields;
  // }
  moveToTarget(items){
    //console.log(items);
    this.keyFieldForm.setValue({sFields:this.sourceFields,tfields:this.targetFields});
    //console.log(this.keyFieldForm.value);
  }
  getAllFields(){
    this.fieldService.getAllFields("PROFILE","1")
    .subscribe(
      data => this.sourceFields = data
    );
  }
  getKeyFields(){
    this.fieldService.getKeyFields("PROFILE","1")
    .subscribe(
      data => {this.targetFields = data;this.sourceFields=this.sourceFields.filter(item=> data.indexOf(item.columnName)<0)},
      (error: any) => this.errorMessage = <any>error
    );
    //console.log(this.sourceFields);
  }
}