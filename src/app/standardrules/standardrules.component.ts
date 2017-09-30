import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, ViewContainerRef } from '@angular/core';
import { ListboxModule, SelectItem } from 'primeng/primeng';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Params } from '@angular/router';
import { GenericValidator } from '../shared/generic-validator';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StandardRulesContext } from '../models/standard-rules-context';
import { StandardRuleService } from '../service/standard-rule.service';
import { IStandardRulesContext } from '../models/interfaces/istandard-rules-context';

@Component({
  selector: 'app-standardrules',
  templateUrl: './standardrules.component.html',
  styleUrls: ['./standardrules.component.css']
})
export class StandardrulesComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  businessProfParam: string;
  standardRulesForm: FormGroup;
  lbSSRL: SelectItem[];
  lbTSRR: SelectItem[];
  selectedSourceSRules: string[] = [];
  selectedTargetSRules: string[] = [];
  errorMessage: string;
  standardRulesContext: StandardRulesContext = new StandardRulesContext();
  selectedStandardRule = '';
  standardRules: any[];

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
    public standardRulesService: StandardRuleService
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
        lbSourceSRules: {},
        lbTargetBSRules: {
            required: 'Target Standard Rule is required.'
        },
        ddStandardRule: {
            required: 'Select the Standard Rule.'
        }
      };
      // Define an instance of the validator for use with this form,
      // passing in this form's set of validation messages.
      this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    //Define the formControlNames
    this.standardRulesForm = this.fb.group({
      ddStandardRule: [0, [Validators.required]],
      lbSourceSRules: ['', []],
      lbTargetSRules: ['', [Validators.required]]
    });

    this.standardRules = [
      {id: '0', value: 'Positive Standard Rules'},
      {id: '1', value: 'Negation Standard Rules'}
    ];
    this.selectedStandardRule = '0';
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.standardRulesForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.standardRulesForm);
    });
  }

  /* METHODS */
  /*Call this function when URL Route Parameter changes*/
  emitMethodCallOnRouteParam(params: Params)
  {
    if (params != null && params.id != null){
      this.businessProfParam = params.id;
      const businessNameProfileNum = this.businessProfParam.split('~');
      if (businessNameProfileNum[0] != null && businessNameProfileNum[1] != null){
        this.getAllStandardRules(businessNameProfileNum[0], businessNameProfileNum[1]);
      }
    }
  }

  /** Region: Fields to Profile */
  onBSRBtnRight()
  {
    if (this.selectedSourceSRules.length > 0){
      let str = '';
      for (const item of this.selectedSourceSRules){
        if (str != '')
          str += ', ';
        str += item;
      }
      this.lbTSRR.push({label: str, value: str});
      //to highlight the selected item on the listbox
      this.selectedTargetSRules = [str];
    }
  }
  /* removing the selected field from the target field */
  onBSRBtnLeft()
  {
    if (this.selectedTargetSRules.length > 0){
      this.selectedTargetSRules.forEach(elm => {
        const indexArrItem = this.lbTSRR.filter(element => elm.indexOf(element.label) >= 0);
        const index: number = this.lbTSRR.indexOf(indexArrItem[0]);
        if (index !== -1) {
            this.lbTSRR.splice(index, 1);
        }
      });
    }
  }

  getAllStandardRules(businessName: string, profileNum: string){
    console.log('getAllStandardRules');
    this.standardRulesService.getAllStandardRules(businessName, profileNum)
    .subscribe( data => {
      this.standardRulesContext = data;
      this.loadStandardRulesOnChanges(this.selectedStandardRule);
      this.lbTSRR = [];
      this.standardRulesContext.standardRulesList.forEach(item => {
        this.lbTSRR.push({label: item.standardRuleDef, value: item.standardRuleDef});
      });
    },
    (error: any) => this.errorMessage = <any>error
    );
  }

  onSelectedStandardRule(standardRuleType){
    this.loadStandardRulesOnChanges(standardRuleType);
  }

  loadStandardRulesOnChanges(ruleType){
    this.lbSSRL = [];
    if (this.selectedStandardRule == '0'){
      this.standardRulesContext.positiveStandardRulesList.forEach(item => {
        this.lbSSRL.push({label: item.standardRuleDef, value: item.standardRuleDef});
      });
    }else {
      this.standardRulesContext.negationStandardRulesList.forEach(item => {
        this.lbSSRL.push({label: item.standardRuleDef, value: item.standardRuleDef});
      });
    }
  }

  save(): void {
    if (this.standardRulesForm.dirty && this.standardRulesForm.valid) {
      this.standardRulesService.saveStandardRulesDetails(this.prepareSaveStandardRules())
      .subscribe(
        details => {
          this.standardRulesContext = details;
        },
        (error: any) => this.errorMessage = <any>error,
        () => this.onComplete()
      );
    }
  }

  prepareSaveStandardRules(): StandardRulesContext {
    const formModel = Object.assign({}, this.standardRulesForm, this.standardRulesForm.value);

    const standardRulesArr: IStandardRulesContext[] = [];
    this.lbTSRR.forEach(item => {
      standardRulesArr.push({standardRuleDef: item.label});
    });
    console.log(standardRulesArr);
    const businessNameProfileNum = this.businessProfParam.split('~');

    const saveStandardRules: StandardRulesContext = {
      standardRulesList: standardRulesArr,
      positiveStandardRulesList: [],
      negationStandardRulesList: [],
      BusinessObjectName: businessNameProfileNum[0],
      profileNum: businessNameProfileNum[1],
      message: '',
      operationSuccess: false
    };
    console.log(saveStandardRules);
    return saveStandardRules;
  }

  onComplete(): void {
    // Reset the form to clear the flags
    if (this.standardRulesContext.operationSuccess){
      if (this.standardRulesContext.message != null)
        this.toastr.success(this.standardRulesContext.message);
        //Refresh the component after save
        if (this.route.snapshot.params['id'] != null){
          console.log(this.route.snapshot.params['id']);
          const params: Params = [{'id': this.route.snapshot.params['id']}];
          params.id = this.route.snapshot.params['id'];
          this.emitMethodCallOnRouteParam(params);
        }
    }else{
      if (this.standardRulesContext.message != null)
        this.toastr.error(this.standardRulesContext.message);
    }
  }
}
