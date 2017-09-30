import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { RuleContext } from '../models/rule-context';
import { RuleServiceService } from '../service/rule-service.service';
import { IRuleControlMasterContext } from '../models/irule-control-master-context';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { ListboxModule } from 'primeng/primeng';
import { IRulesTrendContext } from '../models/i-rules-trend-context';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {
  lblSyntax = '';
  profileNo: any;
  businessProfParam: any;
  txtRuleName = '';
  businessName = '';
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  ruleForm: FormGroup;
  errorMessage: string;
  ruleCategory: IRuleControlMasterContext[];
  ruleDimension: IRuleControlMasterContext[];
  ruleType: IRuleControlMasterContext[];
  functionType: IRuleControlMasterContext[];
  functionAttribute: IRuleControlMasterContext[];
  data: any[];
  rowData: any[];
  ruleContext: RuleContext = new RuleContext();
  syntaxAttribute: IRuleControlMasterContext[];
  selectedRuleCategory = '';
  selectedRuleDimension = '';
  selectedRuleType = '';
  ruleID: number;
  rndRuleType: SelectItem[];
  constructor(
    private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    public ruleService: RuleServiceService,
    private route: ActivatedRoute,
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.route.params.subscribe((params: Params) => {
      /*Call this function when URL Route Parameter changes*/
      this.emitMethodCallOnRouteParam(params);
      this.rndRuleType = [];
    });
  }
  ngOnInit() {
    this.ruleForm = this.fb.group({
      ddRuleCategory: ['', []],
      txtRuleName: '',
      txtDescription: ['', []],
      txtErrorMessage: '',
      ddRuleDimension: ['', []],
      ddRuleType: ['', []],
      ddFunctionType: ['', []],
      ddAttribute: ['', []],
      txtAreaFilter: '',
      txtAreaRule: '',
      fnExistingBusinessName: '',
      lblSyntax: '',
    });
    this.ruleCategory = [];
    this.ruleDimension = [];
    this.ruleType = [];
    this.data = [];
    this.functionType = [];
    this.functionAttribute = [];
    this.callAllAttributesDetailsService();
    this.callAllFunctionTypeService();
    //this.Test();
    this.ruleID = null;
  }
  /*Call this function when URL Route Parameter changes*/
  emitMethodCallOnRouteParam(params: Params) {
    if (params != null && params.id != null) {
      this.businessProfParam = params.id;
      const businessNameProfileNum = this.businessProfParam.split('~');
      if (businessNameProfileNum[0] != null && businessNameProfileNum[1] != null) {
        this.businessName = businessNameProfileNum[0];
        this.profileNo = businessNameProfileNum[1];
        this.callAllRuleData(this.businessName, this.profileNo);
      }
    }
  }
  callAllRuleData(businessName, profileNo) {
    this.ruleService.getAllRules(businessName, profileNo)
      .subscribe(res => {
        this.rowData = res;
      });
  }
  callAllAttributesDetailsService() {
    this.ruleService.getAllAttributesDetails()
      .subscribe(
      details => {
        this.data = details;
        this.ruleCategory = this.data.filter(item => item.attributeType == 'RULE_CATEGORY');
        this.ruleDimension = this.data.filter(item => item.attributeType == 'DQ_DIMENSION');
        this.ruleType = this.data.filter(item => item.attributeType == 'RULE TYPE');
      },
      (error: any) => this.errorMessage = <any>error
      );
  }
  // Test() {
  //   this.ruleService.getAllAttributesDetails()
  //     .subscribe(
  //     details => {
  //       this.data = details;
  //       details.filter(item => item.attributeType == "RULE TYPE")
  //         .forEach(item => {
  //           this.rndRuleType.push
  //             ({ label: item.attributeValues, value: { name: item.attributeValues } });
  //         });
  //     },
  //     (error: any) => this.errorMessage = <any>error
  //     );
  // }

  callAllFunctionTypeService() {
    this.ruleService.getAllFunctionTypeDetails()
      .subscribe(
      functionTypeDetails => {
        this.functionType = functionTypeDetails;
      },
      (error: any) => this.errorMessage = <any>error
      );
  }

  callAllAttributesService(keyTypeId) {
    this.ruleService.getAllFuncBasedOnTypeDetails(keyTypeId)
      .subscribe(attributeDetails => { this.functionAttribute = attributeDetails; },
      (error: any) => this.errorMessage = <any>error);
  }

  callValidationService(masterContext: RuleContext) {
    this.ruleService.callValidationService(masterContext)
      .subscribe(details => { this.ruleContext = details; },
      (error: any) => this.errorMessage = <any>error,
      () => this.onComplete()
      );
  }

  populateSyntax(keyFunctionId) {
    this.ruleService.getAllSyntaxBasedOnFunctionDetails(keyFunctionId)
      .subscribe(syntaxDetail => {
        this.syntaxAttribute = syntaxDetail;
        let tempFunctionSysntax: string;
        this.syntaxAttribute.forEach(element => {
          tempFunctionSysntax = element.functionSyntax;
        });
        this.lblSyntax = tempFunctionSysntax;
        // this.ruleForm.patchValue({
        //   txtAreaRule: tempFunctionSysntax,
        //   txtAreaFilter: tempFunctionSysntax,
        // });
      },
      (error: any) => this.errorMessage = <any>error
      );
  }

  // This event will add value from lblSyntax to Rule Textarea
  AddtoRule() {
    if (this.lblSyntax != null && this.lblSyntax != '') {
      this.ruleForm.patchValue({
        txtAreaRule: this.lblSyntax,
      });
    }
    else
      this.toastr.error('Please select a value from Attributes');
  }

  // This event will add value from lblSyntax to Filter Textarea
  AddtoFilter() {
    if (this.lblSyntax != null && this.lblSyntax != '') {
      this.ruleForm.patchValue({
        txtAreaFilter: this.lblSyntax,
      });
    }
    else
      this.toastr.error('Please select a value from Attributes');
  }

  /* This method is to Validate Rule Textarea on Button click event */
  ValidateRule() {
    const formModel = Object.assign({}, this.ruleForm, this.ruleForm.value);

    if (this.businessName == null || this.businessName == '')
      this.toastr.error('Please select Business');

    if (formModel.txtAreaRule == '')
      this.toastr.error('Please enter in Rule before validating this');

    if (this.businessName != null && this.businessName != '' &&
        formModel.txtAreaRule != null && formModel.txtAreaRule != '') {
      const prepContextArr: IRulesTrendContext[] = [];
      const prepContext: IRulesTrendContext = {
        businessName: this.businessName,
        profileNum: this.profileNo,
        ruleSuccessCondition: formModel.txtAreaRule
      };
      prepContextArr.push(prepContext);
      const masterContext = new RuleContext();
      masterContext.rulesTrendListDO = prepContextArr;
      this.callValidationService(masterContext);
    }
  }

  /* This method is to Validate Filter Textarea on Button click event */
  ValidateFilter() {
    //todo needs to check this
    const formModel = Object.assign({}, this.ruleForm, this.ruleForm.value);

    if (formModel.txtAreaFilter == '')
      this.toastr.error('Please enter in filter before validating this');


    if (formModel.txtAreaFilter != '') {
      const prepContextArr: IRulesTrendContext[] = [];
      const prepContext: IRulesTrendContext = {
        businessName: this.businessName,
        profileNum: this.profileNo,
        ruleSuccessCondition: formModel.txtAreaFilter
      };
      prepContextArr.push(prepContext);
      const masterContext = new RuleContext();
      masterContext.rulesTrendListDO = prepContextArr;
      this.callValidationService(masterContext);
    }
  }

  // This method will be called on Save button click and will save data into DB.
  postRuleData() {
    this.ValidateRule();
    const formModel = Object.assign({}, this.ruleForm, this.ruleForm.value);

    if (this.businessName == null || this.businessName == '') {
      this.toastr.error('Please select Business');
    }
    if (this.selectedRuleCategory == '')
      this.toastr.error('Please select Rule Category');

    if (this.selectedRuleDimension == '')
      this.toastr.error('Please select Rule Dimension');

    if (this.selectedRuleType == '')
      this.toastr.error('Please select Rule Type');

    if (formModel.txtRuleName == null || formModel.txtRuleName == '')
      this.toastr.error('Please enter in RuleName');

    if (formModel.txtErrorMessage == null || formModel.txtErrorMessage == '')
      this.toastr.error('Please enter in Error Message');

    if (formModel.txtAreaRule == null || formModel.txtAreaRule == '')
      this.toastr.error('Please enter in Rule');

    if (this.businessName != '' && this.profileNo != '' && this.selectedRuleCategory != ''
      && this.selectedRuleDimension != '' && this.selectedRuleType != ''
      && formModel.txtRuleName != null && formModel.txtRuleName != ''
      && formModel.txtErrorMessage != null && formModel.txtErrorMessage != ''
      && formModel.txtAreaRule != null && formModel.txtAreaRule != '') {
      const ruleContext = new RuleContext();
      const rulesTrendListDO: IRulesTrendContext[] = [];

      const rulesTrendDO: IRulesTrendContext = {
        businessName: this.businessName,
        profileNum: this.profileNo,
        baseTableName: this.businessName + '_' + this.profileNo,
        ruleCategory: this.selectedRuleCategory,
        ruleDimension: this.selectedRuleDimension,
        ruleType: this.selectedRuleType,
        ruleName: formModel.txtRuleName,
        ruleDescription: formModel.txtDescription,
        ruleFilter: formModel.txtAreaFilter,
        ruleSuccessCondition: formModel.txtAreaRule,
        errorDescription: formModel.txtErrorMessage
      };
      rulesTrendListDO.push(rulesTrendDO);
      ruleContext.rulesTrendListDO = rulesTrendListDO;

      if (this.ruleID != null && this.ruleID > 0) {
        this.ruleService.updateRuleData(this.ruleID, ruleContext)
          .subscribe(details => { this.ruleContext = details; },
          (error: any) => this.errorMessage = <any>error,
          () => this.onComplete()
          );
      }
      else {
        this.ruleService.postRuleData(ruleContext)
          .subscribe(details => { this.ruleContext = details; },
          (error: any) => this.errorMessage = <any>error,
          () => this.onComplete()
          );
      }
    }
  }

  // This method will be used to populate data into the screen once user cliks Edit button in Grid.
  populateGridvaluesToScreen(rulesTrendDO: IRulesTrendContext) {
    const ruleContext = new RuleContext();
    const rulesTrendListDO: IRulesTrendContext[] = [];
    this.ruleID = rulesTrendDO.rulePk;
    this.selectedRuleCategory = rulesTrendDO.ruleCategory;
    this.selectedRuleDimension = rulesTrendDO.ruleDimension;
    this.selectedRuleType = rulesTrendDO.ruleType;

    this.ruleForm.patchValue({
      txtRuleName: rulesTrendDO.ruleName,
      txtDescription: rulesTrendDO.ruleDescription,
      txtErrorMessage: rulesTrendDO.errorDescription,
      txtAreaFilter: rulesTrendDO.ruleFilter,
      txtAreaRule: rulesTrendDO.ruleSuccessCondition
    });
  }

  onComplete(): void {
    // Reset the form to clear the flags
    if (this.ruleContext.operationSuccess) {
      if (this.ruleContext.message != null) {
        this.toastr.success(this.ruleContext.message);
        this.ruleForm.reset();
        this.callAllRuleData(this.businessName, this.profileNo);
        this.txtRuleName = '';
        this.selectedRuleCategory = '';
        this.selectedRuleDimension = '';
        this.selectedRuleType = '';
        this.ruleID = null;
        this.lblSyntax = '';
      }
    } else {
      if (this.ruleContext.message != null)
        this.toastr.error(this.ruleContext.message);
    }
  }

  // callFunctionToCloseAndDisableDropdown(event1) {
  //   console.log("I am into blur");
  //   console.log(event1);
  // }
}
