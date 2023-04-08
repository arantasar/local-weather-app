interface ICurrentWeatherData {
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number;
  };
  sys: {
    country: string;
  };
  dt: number;
  name: string;
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/envionments/environment';
import { ICurrentWeather } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private httpClient: HttpClient) {}

  private convertKelvinToCelcius(kelvin: number): number {
    return kelvin - 273.15;
  }

  private transformToICurrentWeather(
    data: ICurrentWeatherData
  ): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: this.convertKelvinToCelcius(data.main.temp),
      description: data.weather[0].description,
    };
  }

  getCurrentWeather(
    city: string,
    country: string
  ): Observable<ICurrentWeather> {
    const urlParams = new HttpParams()
      .set('q', `${city},${country}`)
      .set('appid', environment.appId);

    return this.httpClient
      .get<ICurrentWeatherData>(environment.baseUrl, {
        params: urlParams,
      })
      .pipe(map((data) => this.transformToICurrentWeather(data)));
  }
}
