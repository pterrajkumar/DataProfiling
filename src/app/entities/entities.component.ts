import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ListboxModule, SelectItem } from "primeng/primeng";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { ProfileServiceService } from "../service/profile-service.service";
import { FormGroup, FormBuilder, FormControlName, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { ProfileContext } from "../models/profile-context";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {
  errorMessage: any;
  entities: SelectItem[]=[];
  entityTreeForm: FormGroup;
  profContext: ProfileContext = new  ProfileContext();
  constructor(
    private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    public profileService: ProfileServiceService,
    private route: ActivatedRoute,
    private router: Router,
  ) 
  {    
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
      details => {
        this.profContext = details;
        console.log(details.list);
        if(details != null && details.list.length > 0)
        details.list.forEach(item => {
          this.entities.push({
            label: item.businessObjectName+"_"+(item.profileNum - 1), 
            value: item.businessObjectName+"~"+(item.profileNum - 1)
          });
        });
      },
      (error: any) => this.errorMessage = <any>error
    );
  }

  onSelected(event){
    if(sessionStorage.getItem('tabRouter') != null)
    {
      let routername:string = "";
      switch(sessionStorage.getItem('tabRouter'))
      {
        case "datatypemetadata":
          routername = sessionStorage.getItem('tabRouter');
          this.router.navigate(['/entities/datatypemetadata', event.value]);
        break;
        case "standardrule":
          routername = sessionStorage.getItem('tabRouter');
          this.router.navigate(['/entities/standardrule', event.value]);
        break;
        case "rules":
          routername = sessionStorage.getItem('tabRouter');
          this.router.navigate(['/entities/rules', event.value]);
        break;
      }        
    }

  }

  /* On tab click, this method will set the name of the tab */
  onTabRouterClick(tab:string){
    this.entityTreeForm.reset();    
    sessionStorage.setItem('tabRouter', tab);
  }
}
