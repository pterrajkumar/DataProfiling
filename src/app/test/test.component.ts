import { Component, OnInit } from '@angular/core';
import { SelectItem } from "primeng/components/common/selectitem";
import {ListboxModule} from 'primeng/primeng';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

   cities: SelectItem[];

    selectedCity: string;

    selectedCities: string[];

    cars: SelectItem[];

    selectedCar: string;
    
  constructor() { 
     this.cities = [];
        this.cities.push({label:'New York', value:'New York'});
        this.cities.push({label:'Rome', value:'Rome'});
        this.cities.push({label:'London', value:'London'});
        this.cities.push({label:'Istanbul', value:'Istanbul'});
        this.cities.push({label:'Paris', value:'Paris'});

        
  }

  ngOnInit() {
  }

  onBusinessNameSelect(businessObjName) {
    console.log(businessObjName);
    this.cars = [];
    if(businessObjName == "Rome")
    {
      this.cars.push({label: 'Audi', value: 'Audi'});
      this.cars.push({label: 'BMW', value: 'BMW'});
    }
    if(businessObjName == "London")
    {
      this.cars.push({label: 'Fiat', value: 'Fiat'});
      this.cars.push({label: 'Ford', value: 'Ford'});
      this.cars.push({label: 'Honda', value: 'Honda'});
      this.cars.push({label: 'Jaguar', value: 'Jaguar'});
    }
    if(businessObjName == "Paris")
    {
       this.cars.push({label: 'Mercedes', value: 'Mercedes'});
        this.cars.push({label: 'Renault', value: 'Renault'});
        this.cars.push({label: 'VW', value: 'VW'});
        this.cars.push({label: 'Volvo', value: 'Volvo'});
    }
  }
}
