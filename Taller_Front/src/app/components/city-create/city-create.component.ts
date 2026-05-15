import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CityService } from '../../services/city.service';
import { CountryService } from '../../services/country.service';
import { City } from '../../models/city.model';
import { Country } from '../../models/country.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/*
 * Implementar: HU-02 — Crear Ciudad
 */

@Component({
  selector: 'app-city-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './city-create.component.html'
})
export class CityCreateComponent implements OnInit {
  private cityService = inject(CityService);
  private countryService = inject(CountryService);

  cityName: string = '';
  selectedCity: City | null = null;
  selectedCountryId: number | null = null;
  countries: Country[] = [];


  @Output() cityCreated = new EventEmitter<City>();
  @Output() cancel = new EventEmitter<void>();

  ngOnInit(): void {
    this.countryService.getCountries().subscribe(countries => this.countries = countries);
  }

  onSave(): void {
    if(!this.cityName || !this.selectedCountryId){return;} 

    const cityData = {
      name: this.cityName,
    };

    this.cityService.createCity(this.selectedCountryId, cityData).subscribe(createdCity =>{
      this.cityCreated.emit(createdCity); 

      this.cityName = '';
      this.selectedCountryId = null;
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
