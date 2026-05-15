import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../models/city.model';
import { WeatherRecord } from '../../models/weather-record.model';
import { WeatherRecordService } from '../../services/weather-record.service';
import { WeatherDetail } from '../../models/weather.model';
import { WeatherService } from '../../services/weather.service';

/*
 * Implementar:
 * HU-03 — Detalle de Ciudad con Clima (Ver TALLER.md Parte B)
 * HU-04 — Historial de Registros de Clima (Ver TALLER.md Parte D)
 */

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-detail.component.html'
})
export class CityDetailComponent implements OnChanges {
  private weatherRecordService = inject(WeatherRecordService);
  private weatherService = inject(WeatherService);

  @Input() city!: City;

  weatherRecords: WeatherRecord[] = [];
  weatherDetail: WeatherDetail | null = null;
  loading: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city'] && this.city) {
      this.weatherRecordService.getRecords(this.city.id)
        .subscribe(records => this.weatherRecords = records);

      // TODO HU-03: Agregar aquí el obtener el clima de la ciudad
    this.loading = true;

      this.weatherService.getWeather(this.city.name)
        .subscribe({next: (weather) => {
          this.weatherDetail = weather;
          this.loading = false;
        },
        error: () => {
          this.weatherDetail = null;
          this.loading = false;
        }
      });
    }
  }


  saveWeather(): void {
    
    if (!this.weatherDetail || !this.city) {return;}

    const weatherRecord = {
      tempC: this.weatherDetail.temp_c,
      condition: this.weatherDetail.condition,
      humidity: this.weatherDetail.humidity,
    };

    this.weatherRecordService.saveRecord(this.city.id, weatherRecord).subscribe(() => {
      this.weatherRecordService.getRecords(this.city.id).subscribe(records => this.weatherRecords = records);
    });
  }
}
