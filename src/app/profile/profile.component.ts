
import { Component, OnInit, Input, ElementRef, ViewContainerRef, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { Message, ConfirmationService } from 'primeng/components/common/api';
import { IProfileInterfaceContext } from '../models/iprofile-context';
import { IProfileControlMasterContext } from '../models/iprofile-control-master-context';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ProfileServiceService } from '../service/profile-service.service';
import { RadioButtonModule, InputTextModule, TooltipModule, DialogModule, SelectItem } from 'primeng/primeng';
import { ProfileContext } from '../models/profile-context';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService]
})
export class ProfileComponent implements OnInit {
  msgs: Message[];
  errorMessage: string;
  profileForm: FormGroup;
  selectedValue = 1;
  txtBusinessName = '';
  existingBusinessName: SelectItem[];
  selectedBusinessName = '';
  selectedProfileNum = '';
  newprofile = true;
  existingprofile = false;
  copyMetaData = false;
  chkCopyMetaValue = false;
  displayDialog = false;
  /* isProfileNumIncreased: boolean = false; */
  profileContext: ProfileContext = new ProfileContext();
  metaProfileContext: ProfileContext = new ProfileContext();
  //profileControlMaster: IProfileControlMasterContext[];
  profileNumContext: IProfileControlMasterContext[];

  @Input() profileInterfaceContext: IProfileInterfaceContext;

  constructor(
    private fb: FormBuilder,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    public profileService: ProfileServiceService,
    private confirmationService: ConfirmationService
  )
  {
    this.toastr.setRootViewContainerRef(vcr);
    this.existingBusinessName = [];
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      rdprofile: [],
      ddbusinessname: ['0', []],
      ddprofilenumber: [1, []],
      txtbusinessname: '',
      chkCopyMetadata: '1',
      fnExistingBusinessName: ''
    });

    /* Init the New Profile Dataset UI */
    this.onRdProfileClick(this.selectedValue);
  }

  /* DOM Events */
  myUploader(event) {
      for (const file of event.files) {
          this.uploadFileService(file);
      }
  }

  onRdProfileClick(val) {
    this.selectedValue = val;
    this.txtBusinessName = '';
    this.selectedBusinessName = '';
    this.selectedProfileNum = '';
    if (this.selectedValue === 1) {
      if (this.profileContext.list != null)
        this.profileContext.list = null;
      this.profileNumContext = [{'businessObjectName': '', 'profileNum': 1}];
      this.newprofile = true;
      this.existingprofile = false;
      this.copyMetaData = false;
      this.chkCopyMetaValue = false;
    } else {
      this.newprofile = false;
      this.existingprofile = true;
      this.chkCopyMetaValue = false;
      this.copyMetaData = false;
      this.profileNumContext = [];
      /*Call the Profile Service to get the Business Object
      and Profile Number*/
      this.callAllProfileDetailsService();
    }
  }

  onBusinessNameSelect(businessObjName) {
    this.profileNumContext = [];
    this.profileNumContext = this.profileContext.list.filter(
      item => item.businessObjectName == businessObjName);

    /* if(!this.isProfileNumIncreased){
      this.profileControlMaster.forEach(element => {
        element.profileNum += 1;
      });
      this.isProfileNumIncreased = true;
    } */
  }

  /*  */
  onChkMetaClick()
  {
    if (this.chkCopyMetaValue == true){
      this.showDialog();
    }else {
      this.copyMetaData = false;
    }
  }

  /* Event to display the dialog on checking the CopyMetaData checkbox*/
  showDialog() {
    this.displayDialog = true;
  }

  /* This Event emits on clicking the Ok button on Dialog */
  dialogOK() {
    //Enable the button to copy MetaData
    this.copyMetaData = true;
  }

  /* This Events emits on Dialog cancellation*/
  dialogCancel(){
    this.chkCopyMetaValue = false;
    this.copyMetaData = false;
  }

  /* Copy MetaData Button click event */
  copyMetaDataClick(){
    if (this.selectedBusinessName == '')
      this.toastr.error('Please select the Business Name!');

    if (this.selectedProfileNum == '')
      this.toastr.error('Please select the Profile Number!');

    if (this.selectedBusinessName != '' && this.selectedProfileNum != ''){
      const prepContextArr: IProfileControlMasterContext[] = [];
      const prepContext: IProfileControlMasterContext = {
        businessObjectName: this.selectedBusinessName,
        profileNum: Number(this.selectedProfileNum)
      };
      prepContextArr.push(prepContext);
      const masterContext = new ProfileContext();
      masterContext.miniProfileControlMasterDO = prepContextArr;
      this.callCopyMetaDataService(masterContext);
    }
  }

  /* SERVICE CALLS */
  /* Used for file Upload */
  uploadFileService(files) {
    const profileDetails: string = this.retrieveFormDetailsForUpload();
    this.profileService.uploadFileRequest(files, profileDetails)
        .subscribe(
          details => {
            this.profileContext = details;
          },
          (error: any) => this.errorMessage = <any>error,
          () => this.onComplete()
        );
  }

  callAllProfileDetailsService() {
    this.profileContext.list = [];
    this.profileService.getAllProfileDetails()
    .subscribe(
      details => {
        this.profileContext = details;
        details.list.forEach(item => {
          this.existingBusinessName.push({label: item.businessObjectName, value: {name: item.businessObjectName}});
        });
      },
      (error: any) => this.errorMessage = <any>error,
      () => this.onComplete()
    );
  }

  callCopyMetaDataService(masterContext: ProfileContext) {
    this.profileService.callCopyMetaDataService(masterContext)
    .subscribe(
      details => {
        this.metaProfileContext = details;
      },
      (error: any) => this.errorMessage = <any>error,
      () => this.onMetaCopyComplete()
    );
  }

  //TODO: Not used.
  /* async callUploadFileService(files): Promise<void> {
    //this.profileInterfaceContext = this.prepareUploadFile(files);
    await this.profileService.uploadFile(files);
    this.onSaveComplete();
  } */

  //TODO: Call this if existing dataset radio button is click
 /*  async callAllProfileDetailsService(): Promise<IProfileControlMasterContext[]> {
    let controlMaster = await this.profileService.getAllProfileDetails();
    return this.profileControlMaster;
  } */

  save() {
  }

  retrieveFormDetailsForUpload(): string {
    // Copy the form values over the product object values
    const formModel = Object.assign({}, this.profileForm, this.profileForm.value);
    let businessName = '';
    if (formModel.rdprofile == 1) {
      businessName = formModel.txtbusinessname as string;
    }else {
      businessName = formModel.ddbusinessname as string;
    }
    const profileNum = formModel.ddprofilenumber as number;
    return businessName + '~' + profileNum as string;
  }

  /* PRIVATE METHODS */
  private prepareUploadFile(files): IProfileInterfaceContext {
    const saveUploadFile: IProfileInterfaceContext = {
      UploadFiles: files
    };
    return saveUploadFile;
  }

  onComplete(): void {
    // Reset the form to clear the flags
    if (this.profileContext.operationSuccess){
      if (this.profileContext.message != null)
        this.toastr.success(this.profileContext.message);
    }else{
      if (this.profileContext.message != null)
        this.toastr.error(this.profileContext.message);
    }
  }

  onMetaCopyComplete(): void {
    // Reset the form to clear the flags
    if (this.metaProfileContext.operationSuccess){
      if (this.metaProfileContext.message != null)
        this.toastr.success(this.metaProfileContext.message);
    }else{
      if (this.metaProfileContext.message != null)
        this.toastr.error(this.metaProfileContext.message);
    }
  }
}
