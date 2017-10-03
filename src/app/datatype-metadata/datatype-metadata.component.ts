import { Component, OnInit, ViewContainerRef, Input, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { FileUploadModule, ListboxModule, SelectItem, DataTableModule, SharedModule } from 'primeng/primeng';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Params } from '@angular/router';
import { FieldServiceService } from '../service/field-service.service';
import { FieldsContext } from '../models/fields-context';
import { IMetaDatatypeTrend } from '../models/interfaces/imetadatatypetrend';
import { ProfileServiceService } from '../service/profile-service.service';
import { ProfileContext } from '../models/profile-context';
import { GenericValidator } from '../shared/generic-validator';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IFieldContext } from '../models/interfaces/ifield-context';

@Component({
  selector: 'app-datatype-metadata',
  templateUrl: './datatype-metadata.component.html',
  styleUrls: ['./datatype-metadata.component.css']
})
export class DatatypeMetadataComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  businessProfParam: string;
  datatypeMetadataForm: FormGroup;
  metadataValue: any[];
  errorMessage: string;
  sourceFields: any[];
  targetFields: any[];
  sourceKeyFields: any[];
  targetKeyFields: any[];
  sourceUniqueIdFields: any[];
  targetUniqueIdFields: any[];
  fieldsContext: FieldsContext = new FieldsContext();
  lbSF: SelectItem[];
  lbTF: SelectItem[];
  lbSKF: SelectItem[];
  lbTKF: SelectItem[];
  lbSUIF: SelectItem[];
  lbTUIF: SelectItem[];
  selectedSourceFields: string[]= [];
  selectedTargetFields: string[]= [];
  selectedSourceKeyFields: string[]= [];
  selectedTargetKeyFields: string[]= [];
  selectedSourceUniqueIdFields: string[]= [];
  selectedTargetUniqueIdFields: string[]= [];

  metaCols: any[];
  metaDataTypes: IMetaDatatypeTrend[];

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

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

      // Defines all of the validation messages for the form.
      // These could instead be retrieved from a file or database.
      this.validationMessages = {
        /*Name: {
            required: 'Product name is required.',
            minlength: 'Product name must be at least three characters.',
            maxlength: 'Product name cannot exceed 50 characters.'
        },*/
        lbTargetFields: {
          required: 'Field to Profile is required.'
        },
        lbTargetKeyFields: {
            required: 'Key Field is required.'
        },
        lbTargetUniqueIdFields: {
          required: 'Unique Identifier Field is required.'
        }
      };
      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    //Define the formControlNames
    this.datatypeMetadataForm = this.fb.group({
      sFields: [],
      tfields: [],
      lbSourceFields: [],
      lbTargetFields: ['', [Validators.required]],
      lbSourceKeyFields: [],
      lbTargetKeyFields: ['', [Validators.required]],
      lbSourceUniqueIdFields: [],
      lbTargetUniqueIdFields: ['', [Validators.required]]
    });
    this.sourceFields = [];
    this.targetFields = [];
    this.sourceKeyFields = [];
    this.targetKeyFields = [];
    this.sourceUniqueIdFields = [];
    this.targetUniqueIdFields = [];

    //TODO: to be removed
    this.metaCols = [
      {field: 'businessObjectName', header: 'BUSINESS NAME'},
      {field: 'profileNum', header: 'PROFILE NUM'},
      {field: 'srcColumnName', header: 'SOURCE COLUMN'},
      {field: 'srcColumnDataType', header: 'SOURCE DATATYPE'},
      {field: 'srcNullable', header: 'SOURCE NULLABLE'},
      {field: 'tgtColumnName', header: 'TARGET COLUMN'},
      {field: 'tgtColumnDatatype', header: 'TARGET DATATYPE'},
      {field: 'tgtNullable', header: 'TARGET NULLABLE'}
    ];
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.datatypeMetadataForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.datatypeMetadataForm);
    });
  }

  /* EVENTS */
  myUploader(event) {
    for (const file of event.files) {
      this.uploadFileService(file);
    }
  }

  /* METHODS */
  /*Call this function when URL Route Parameter changes*/
  emitMethodCallOnRouteParam(params: Params)
  {
    if (params != null && params.id != null){
      this.businessProfParam = params.id;
      const businessNameProfileNum = this.businessProfParam.split('~');
      if (businessNameProfileNum[0] != null && businessNameProfileNum[1] != null){
        this.getAllFields(businessNameProfileNum[0], businessNameProfileNum[1]);
      }
    }
  }

  getAllFields(bussinessName: string, profileNum: string) {
    this.fieldService.getAllFields(bussinessName, profileNum)
      .subscribe( data => {
        this.fieldsContext = data;
        /** Region: Fields to Profile */
        this.sourceFields = this.fieldsContext.allFields;
        this.targetFields = this.fieldsContext.fieldToProfileList;

        this.lbSF = [];
        this.fieldsContext.allFields.forEach(item => {
          this.lbSF.push({label: item.columnName, value: item.columnName});
        });

        this.lbTF = [];
        this.fieldsContext.fieldToProfileList.forEach(item => {
          this.lbTF.push({label: item.columnName, value: item.columnName});
        });
        /** Region: Key Fields */
        this.sourceKeyFields = this.fieldsContext.allFields;
        this.targetKeyFields = this.fieldsContext.keyFields;

        this.lbSKF = [];
        this.fieldsContext.allFields.forEach(item => {
          this.lbSKF.push({label: item.columnName, value: item.columnName});
        });

        this.lbTKF = [];
        this.fieldsContext.keyFields.forEach(item => {
          this.lbTKF.push({label: item.columnName, value: item.columnName});
        });
        /** Region: Unique Identifier */
        this.sourceUniqueIdFields = this.fieldsContext.allFields;
        this.targetUniqueIdFields = this.fieldsContext.uniqueIdentifierFields;
        this.lbSUIF = [];
        this.fieldsContext.allFields.forEach(item => {
          this.lbSUIF.push({label: item.columnName, value: item.columnName});
        });
        this.lbTUIF = [];
        this.fieldsContext.uniqueIdentifierFields.forEach(item => {
          this.lbTUIF.push({label: item.columnName, value: item.columnName});
        });
        /** MetaDatatypeTrend Grid  */
        this.metaDataTypes = [];
        this.fieldsContext.metaDatatypes.forEach(item => {
          this.metaDataTypes.push(item);
        });

      },
      (error: any) => this.errorMessage = <any>error
      );
  }

  /** Region: Fields to Profile */
  onBtnToRight()
  {
    if (this.selectedSourceFields.length > 0){
      /* let str = '';
      for (const item of this.selectedSourceFields){
        if (str != '')
          str += ', ';
        str += item;
      }
      this.lbTF.push({label: str, value: str}); */
      this.selectedSourceFields.forEach( item => {
        this.lbTF.push({label: item, value: item});
        this.selectedTargetFields = [item];
      });
      //to highlight the selected item on the listbox
      //this.selectedTargetFields = [str];
    }
  }
  /* removing the selected field from the target field */
  onBtnToLeft()
  {
    if (this.selectedTargetFields.length > 0){
      this.selectedTargetFields.forEach(elm => {
        const indexArrItem = this.lbTF.filter(element => elm.indexOf(element.label) >= 0);
        const index: number = this.lbTF.indexOf(indexArrItem[0]);
        if (index !== -1) {
            this.lbTF.splice(index, 1);
        }
      });
    }
  }

   /** Region: Key Fields */
  onKFBtnRight()
  {
    if (this.selectedSourceKeyFields.length > 0){
      let str = '';
      for (const item of this.selectedSourceKeyFields){
        if (str != '')
          str += ', ';
        str += item;
      }
      this.lbTKF.push({label: str, value: str});
      this.selectedTargetKeyFields = [str];
    }
  }

  onKFBtnLeft()
  {
    if (this.selectedTargetKeyFields.length > 0){
      this.selectedTargetKeyFields.forEach(elm => {
        const indexArrItem = this.lbTKF.filter(element => elm.indexOf(element.label) >= 0);
        const index: number = this.lbTKF.indexOf(indexArrItem[0]);
        if (index !== -1) {
            this.lbTKF.splice(index, 1);
        }
      });
    }
  }
  /** Region UniqueIdentifier Fields */
  onUniqueIdBtnRight()
  {
    if (this.selectedSourceUniqueIdFields.length > 0){
      /* let str = '';
      for (const item of this.selectedSourceUniqueIdFields){
        if (str != '')
          str += ', ';
        str += item;
      }
      this.lbTUIF.push({label: str, value: str});
      this.selectedTargetUniqueIdFields = [str]; */
      this.selectedSourceUniqueIdFields.forEach( item => {
        this.lbTUIF.push({label: item, value: item});
        this.selectedTargetUniqueIdFields = [item]; 
      });

    }
  }

  onUniqueIdBtnLeft()
  {
    if (this.selectedTargetUniqueIdFields.length > 0){
      this.selectedTargetUniqueIdFields.forEach(elm => {
        const indexArrItem = this.lbTUIF.filter(element => elm.indexOf(element.label) >= 0);
        const index: number = this.lbTUIF.indexOf(indexArrItem[0]);
        if (index !== -1) {
            this.lbTUIF.splice(index, 1);
        }
      });
    }
  }

  uploadFileService(files) {
    this.fieldService.uploadFileRequest(files, this.businessProfParam)
      .subscribe(
        details => {
          this.fieldsContext = details;
        },
        (error: any) => this.errorMessage = <any>error,
      () => this.onComplete()
    );
  }

  save(): void {
    if (this.datatypeMetadataForm.dirty && this.datatypeMetadataForm.valid) {
      //let formModel = Object.assign({}, this.datatypeMetadataForm, this.datatypeMetadataForm.value);
      this.fieldService.saveMetadataDetails(this.prepareSaveMetadataTypeBooking())
      .subscribe(
        details => {
          this.fieldsContext = details;
        },
        (error: any) => this.errorMessage = <any>error,
        () => this.onComplete()
      );
    }
  }

  prepareSaveMetadataTypeBooking(): FieldsContext {
    const formModel = Object.assign({}, this.datatypeMetadataForm, this.datatypeMetadataForm.value);

    const fldToProfileList: IFieldContext[] = [];
    this.lbTF.forEach(item => {
      fldToProfileList.push({columnName: item.label});
    });
    console.log(fldToProfileList);

    const keyFldList: IFieldContext[] = [];
    this.lbTKF.forEach(item => {
      keyFldList.push({columnName: item.label});
    });

    const uniqueIdList: IFieldContext[] = [];
    this.lbTUIF.forEach(item => {
      uniqueIdList.push({columnName: item.label});
    });

    const businessNameProfileNum = this.businessProfParam.split('~');

    const saveMetaDataTypeBooking: FieldsContext = {
      fieldContextList: [],
      fieldToProfileList: fldToProfileList,
      allFields: [],
      uniqueIdentifierFields: uniqueIdList,
      keyFields: keyFldList,
      businessName: businessNameProfileNum[0],
      profileNum: businessNameProfileNum[1],
      message: '',
      operationSuccess: false,
      metaDatatypes: []
    };
    console.log(saveMetaDataTypeBooking);

    return saveMetaDataTypeBooking;
  }

  onComplete(): void {
    // Reset the form to clear the flags
    if (this.fieldsContext.operationSuccess){
      if (this.fieldsContext.message != null)
        this.toastr.success(this.fieldsContext.message);
        //Refresh the component after save
        if (this.route.snapshot.params['id'] != null){
          console.log(this.route.snapshot.params['id']);
          const params: Params = [{'id': this.route.snapshot.params['id']}];
          params.id = this.route.snapshot.params['id'];
          this.emitMethodCallOnRouteParam(params);
        }
    }else{
      if (this.fieldsContext.message != null)
        this.toastr.error(this.fieldsContext.message);
    }
  }
}
