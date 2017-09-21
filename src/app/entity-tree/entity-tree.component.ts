import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { IProfileControlMasterContext } from "../models/iprofile-control-master-context";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ProfileServiceService } from '../service/profile-service.service';
import { ListboxModule,SelectItem } from "primeng/primeng";

@Component({
  selector: 'app-entity-tree',
  templateUrl: './entity-tree.component.html',
  styleUrls: ['./entity-tree.component.css']
})
export class EntityTreeComponent implements OnInit {
  errorMessage: any;
  entities: SelectItem[];
  entityTreeForm: FormGroup

  constructor(private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    public profileService: ProfileServiceService) {
      this.toastr.setRootViewContainerRef(vcr);
     }

  ngOnInit() {
    this.entityTreeForm=this.fb.group({
      entity:String
    });
    this.callAllProfileDetailsService();
  }
  callAllProfileDetailsService() {
    this.profileService.getAllProfileDetails()
    .subscribe(
      details => {this.entities = details.list.map(function(item){
        return <SelectItem>{
          label:item.businessObjectName+"_"+item.profileNum,
          value:item
        }})},
      (error: any) => this.errorMessage = <any>error
      //() => this.onSaveComplete()      
    );    
  }
  onSelected(event){
    console.log(event);
  }
}

