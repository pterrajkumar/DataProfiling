import { Component, OnInit } from '@angular/core';
import { FieldToProfileComponent } from "../field-to-profile/field-to-profile.component";
import { KeyFieldComponent } from "../key-field/key-field.component";
import { DatatypeMetadataComponent } from "../datatype-metadata/datatype-metadata.component";
import { UniqueIdentifierFieldComponent } from "../unique-identifier-field/unique-identifier-field.component";

@Component({
  selector: 'app-metadata-tab',
  templateUrl: './metadata-tab.component.html',
  styleUrls: ['./metadata-tab.component.css']
})
export class MetadataTabComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
