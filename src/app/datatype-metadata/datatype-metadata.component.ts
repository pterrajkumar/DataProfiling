import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { FileUploadModule, ListboxModule, SelectItem } from "primeng/primeng";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Params } from '@angular/router';
import { FieldServiceService } from '../service/field-service.service';
import { FieldsContext } from '../models/fields-context';
@Component({
  selector: 'app-datatype-metadata',
  templateUrl: './datatype-metadata.component.html',
  styleUrls: ['./datatype-metadata.component.css']
})
export class DatatypeMetadataComponent implements OnInit {
  datatypeMetadataForm: FormGroup;
  metadataValue: any[];
  errorMessage: string;
  sourceFields: any[];
  targetFields: any[];
  fieldsContext: FieldsContext = new FieldsContext();
  private _id: any;
  lbSF: SelectItem[];
  lbTF: SelectItem[];
  selectedSourceFields: string[]=[];
  selectedTargetFields: string[]=[];

  constructor
  (
    private fb: FormBuilder,
    public toastr: ToastsManager, 
    vcr: ViewContainerRef,
    private route: ActivatedRoute,
    public fieldService: FieldServiceService
  ) 
  { 
    this.toastr.setRootViewContainerRef(vcr);
    this.route.params.subscribe((params: Params) => {
      /*Call this function when URL Route Parameter changes*/ 
      this.emitMethodCallOnRouteParam(params);
    });   
    this.lbSF = []; 
  }

  ngOnInit() {
    console.log(this._id);
    //Define the formControlNames
    this.datatypeMetadataForm = this.fb.group({
      //lbFieldsToProfile:['',[]],
      sFields: [],
      tfields: [],
      lbSourceFields:[],
      lbTargetFields:[]
    });
    this.sourceFields = [];//initialize list 1
    this.targetFields = [];//initialize list 2
    this.metadataValue = [{ label: 1, value: 1 }, { label: 2, value: 2 }, { label: 3, value: 3 }];
  }

  /* EVENTS */
  myUploader(event) {
    for (let file of event.files) {
      this.uploadFileService(file);
    }
  }

  moveToTarget(items) {    
    this.datatypeMetadataForm.setValue({ sFields: this.sourceFields, tfields: this.targetFields });
    console.log(this.targetFields);
  }

  /* METHODS */
  /*Call this function when URL Route Parameter changes*/
  emitMethodCallOnRouteParam(params: Params)
  {
    if(params != null && params.id != null){
      let businessProfParam: string = params.id;
      var businessNameProfileNum = businessProfParam.split("~");
      if(businessNameProfileNum[0] != null && businessNameProfileNum[1] != null){
        this.getAllFields(businessNameProfileNum[0], businessNameProfileNum[1]);
      }
    }    
  }


  getAllFields(bussinessName:string, profileNum:string) {
    this.fieldService.getAllFields(bussinessName, profileNum)
      .subscribe( data => {
        this.fieldsContext = data; 
        this.sourceFields = this.fieldsContext.allFields;
        this.targetFields = this.fieldsContext.fieldToProfileList;
        console.log("All Fields:");
        
        this.lbSF=[];
        this.fieldsContext.allFields.forEach(item => {
          this.lbSF.push({label: item.columnName, value: item.columnName});
        });  
        
        this.lbTF=[];
        this.fieldsContext.fieldToProfileList.forEach(item => {
          this.lbTF.push({label: item.columnName, value: item.columnName});
        });
             
      },
      (error: any) => this.errorMessage = <any>error
      );
  }

  onBtnToRight()
  {
    if(this.selectedSourceFields.length > 0){
      let str:string="";
      for(let item of this.selectedSourceFields){
        if(str !="")
          str += ', ';
        str += item;
      }
      this.lbTF.push({label:str, value:str});
    }
  }
  /* removing the selected field from the target field */
  onBtnToLeft()
  {
    if(this.selectedTargetFields.length > 0){
      this.selectedTargetFields.forEach(elm => {
        var indexArrItem = this.lbTF.filter(element => elm.indexOf(element.label) >= 0);
        const index: number = this.lbTF.indexOf(indexArrItem[0]);
        if (index !== -1) {
            this.lbTF.splice(index, 1);
        }
      });
    }
  }

  uploadFileService(files) {
    // this.profileService.UploadFileRequest(files)
    //   .subscribe(
    //   () => this.onSaveComplete(),
    //   (error: any) => this.errorMessage = <any>error
    //   );
  }
  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.toastr.success('Successfuly saved the data!', 'Success!');
  }

}
