import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import {PickListModule} from 'primeng/primeng';
import { FieldServiceService } from "../service/field-service.service";


@Component({
  selector: 'app-unique-identifier-field',
  templateUrl: './unique-identifier-field.component.html',
  styleUrls: ['./unique-identifier-field.component.css']
})
export class UniqueIdentifierFieldComponent implements OnInit {

  uniqueIdentifierFieldForm: FormGroup;
  sourceFields: any[];
  targetFields: any[];
  constructor(private fb: FormBuilder,
    public fieldService:FieldServiceService) { }

    ngOnInit() {
      this.uniqueIdentifierFieldForm = this.fb.group({
        sFields:[],
        tfields:[]
      });
      this.sourceFields = [];//initialize list 1
      this.targetFields = [];//initialize list 2
      this.getAllFields();
    }
    getSelectedColumns(){
      //this.fieldService.setFieldsToProfile(this.targetFields);
      //return this.targetFields;
    }
    moveToTarget(items){
      //console.log(items);
      this.uniqueIdentifierFieldForm.setValue({sFields:this.sourceFields,tfields:this.targetFields});
      //console.log(this.uniqueIdentifierFieldForm.value);
    }
    getAllFields(){
      /* this.fieldService.getAllFields("profile","1")
      .subscribe(
        data => this.sourceFields = data
      ); */
    }


}
