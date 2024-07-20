import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  constructor() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmljMjMzMzMyIiwiYSI6ImNsdnc4emFrdjI1cDEyaW8wM2c3eHBzOXcifQ.1-puGhsFZFr7T_lU3f1nqQ';
  }

  getMap(container: string, center: [number, number], zoom: number): mapboxgl.Map {
    return new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom
    });
  }

  getRoute(start: [number, number], end: [number, number]): Promise<any> {
    return fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(',')};${end.join(',')}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => data.routes[0].geometry.coordinates);
  }
}
