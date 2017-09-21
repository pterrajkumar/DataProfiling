import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { RuleContext } from "../models/rule-context";
import { RuleServiceService } from "../service/rule-service.service";
import { IRuleControlMasterContext } from "../models/irule-control-master-context";
import { ToastsManager } from "ng2-toastr/src/toast-manager";
import { ListboxModule } from 'primeng/primeng';
import { IRulesTrendContext } from "../models/i-rules-trend-context";

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  ruleForm: FormGroup;
  errorMessage: string;
  ruleCategory: IRuleControlMasterContext[];
  ruleDimension: IRuleControlMasterContext[];
  ruleType: IRuleControlMasterContext[];
  functionType: IRuleControlMasterContext[];
  functionAttribute: IRuleControlMasterContext[];
  data: any[];
  ruleContext: RuleContext = new RuleContext();

  constructor(
    private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    public ruleService: RuleServiceService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }
  ngOnInit() {
    this.ruleForm = this.fb.group({
      ddRuleCategory: ['',[]],
      txtRuleName: ['',[]],
      txtDescription: ['',[]],
      txtErrorMessage: ['',[]],
      ddRuleDimension: ['',[]],
      ddRuleType: ['',[]],
      ddFunctionType: ['',[]],
      ddAttribute: ['', []],
      txtAreaFilter: ['',[]],
      txtAreaRule: ['',[]]
    });

    this.ruleCategory = [];
    this.ruleDimension = [];
    this.ruleType = [];
    this.data = [];
    this.functionType = [];
    this.functionAttribute = [];
    this.callAllAttributesDetailsService();
    this.callAllFunctionTypeService();
  }
  callAllAttributesDetailsService() {
    this.ruleService.getAllAttributesDetails()
      .subscribe(
      details => {
        this.data = details;
        this.ruleCategory = this.data.filter(item => item.attributeType == "RULE_CATEGORY");
        this.ruleDimension = this.data.filter(item => item.attributeType == "DQ_DIMENSION");
        this.ruleType = this.data.filter(item => item.attributeType == "RULE TYPE");
      },
      (error: any) => this.errorMessage = <any>error
      );
  }
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
      .subscribe(
      attributeDetails => {
      this.functionAttribute = attributeDetails;
      // Copy the form values over the product object values
      let formModel = Object.assign({}, this.ruleForm, this.ruleForm.value);
      this.ruleForm.patchValue({
        txtAreaRule: "Hello who are you"
      });
      console.log(formModel.txtAreaRule);



      },
      (error: any) => this.errorMessage = <any>error
      );
  }
  postRuleData() {
    let ruleContext = new RuleContext();
    let rulesTrendListDO: IRulesTrendContext[] = [];
    
    const rulesTrendDO: IRulesTrendContext = {     
      businessName: "Profile",            
      profileNum: 1,
      baseTableName: "Profile",   
      ruleCategory: "",   
      ruleDimension: "",   
      ruleType: "", 
      ruleName: "", 
      ruleDescription: "",
      ruleFilter: "",
      ruleSuccessCondition: ""
    }
    rulesTrendListDO.push(rulesTrendDO);
    ruleContext.rulesTrendListDO = rulesTrendListDO;
    this.ruleService.postRuleData(ruleContext)
    .subscribe(
      details => {
        this.ruleContext = details;
      },
      (error: any) => {this.errorMessage = <any>error,() => this.onComplete()}
      );
  }
  onComplete(): void {
    // Reset the form to clear the flags
    if(this.ruleContext.operationSuccess){
      if(this.ruleContext.message != null)
        this.toastr.success(this.ruleContext.message);
    }else{
      if(this.ruleContext.message != null)
        this.toastr.error(this.ruleContext.message);
    }    
  }
}
