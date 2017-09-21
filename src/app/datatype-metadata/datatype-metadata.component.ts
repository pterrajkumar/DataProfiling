import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { FileUploadModule, ListboxModule } from "primeng/primeng";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-datatype-metadata',
  templateUrl: './datatype-metadata.component.html',
  styleUrls: ['./datatype-metadata.component.css']
})
export class DatatypeMetadataComponent implements OnInit {

  datatypeMetadataForm: FormGroup;
  metadataValue: any[];
  errorMessage: string;
  constructor(
    private fb: FormBuilder,
    public toastr: ToastsManager, 
    vcr: ViewContainerRef,
    private route: ActivatedRoute,
  ) 
  { 
    this.toastr.setRootViewContainerRef(vcr);
    console.log(this.route.snapshot.params['id']);
  }

  ngOnInit() {

    this.datatypeMetadataForm = this.fb.group({
    });
    this.metadataValue = [{ label: 1, value: 1 }, { label: 2, value: 2 }, { label: 3, value: 3 }];
  }

  myUploader(event) {
    for (let file of event.files) {
      this.uploadFileService(file);
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
