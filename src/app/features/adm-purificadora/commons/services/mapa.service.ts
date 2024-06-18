import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapaService implements OnInit {

  private ubicacionesSubject = new BehaviorSubject<{ longitud: string, latitud: string }[]>([]);
  ubicaciones$ = this.ubicacionesSubject.asObservable();

  private markers: Map<string, mapboxgl.Marker> = new Map();

  latitudLongitudCambiadas: EventEmitter<{ latitud: number, longitud: number }> = new EventEmitter();

  mapbox = (mapboxgl as typeof mapboxgl);
  map!: mapboxgl.Map;

  cbAddress: EventEmitter<any> = new EventEmitter<any>();

  style = 'mapbox://styles/mapbox/satellite-streets-v12';
  lat = 21.096391850541213;
  lng = -98.46080933099502;
  zoom = 5;

  constructor() {
    console.log(environment.mapPk);
  }

  ngOnInit(): void {
    this.buildMap();
  }

  buildMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          accessToken: environment.mapPk,
          container: 'map',
          style: this.style,
          zoom: this.zoom,
          center: [this.lng, this.lat]
        });
        this.map.addControl(new mapboxgl.NavigationControl());
        this.map.addControl(new mapboxgl.FullscreenControl());

        this.map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));

        this.map.on('geolocate', (position) => {
          const { latitude, longitude } = position.coords;
          this.map.setCenter([longitude, latitude]);
        });

        const geocoder = new MapboxGeocoder({
          accessToken: environment.mapPk,
          mapboxgl
        });
        resolve({
          map: this.map,
          geocoder
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  setUbicaciones(ubicaciones: { longitud: string, latitud: string }[]) {
    this.ubicacionesSubject.next(ubicaciones);
    console.log("llega a servicio setUbicaciones", ubicaciones);
    this.updateMarkers(ubicaciones);
    this.centrarMapa(ubicaciones);
  }

  addMarker(lat: number, lng: number) {
    const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);
    const key = `${lat}-${lng}`;
    this.markers.set(key, marker);
  }

  removeMarkersNotInList(ubicaciones: { longitud: string, latitud: string }[]) {
    const currentMarkerKeys = Array.from(this.markers.keys());
    const newMarkerKeys = ubicaciones.map(p => `${p.latitud}-${p.longitud}`);

    currentMarkerKeys.forEach(key => {
      if (!newMarkerKeys.includes(key)) {
        const marker = this.markers.get(key);
        if (marker) {
          marker.remove();
          this.markers.delete(key);
        }
      }
    });
  }

  private updateMarkers(ubicaciones: { longitud: string, latitud: string }[]) {
    this.removeMarkersNotInList(ubicaciones);
    ubicaciones.forEach(punto => {
      const lat = parseFloat(punto.latitud);
      const lng = parseFloat(punto.longitud);
      if (!isNaN(lat) && !isNaN(lng)) {
        const key = `${lat}-${lng}`;
        if (!this.markers.has(key)) {
          this.addMarker(lat, lng);
        }
      }
    });
  }

  private centrarMapa(ubicaciones: { longitud: string, latitud: string }[]) {
    if (ubicaciones.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      ubicaciones.forEach(punto => {
        const lat = parseFloat(punto.latitud);
        const lng = parseFloat(punto.longitud);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend([lng, lat]);
        }
      });
      const center = bounds.getCenter();
      this.map.flyTo({ center: [center.lng, center.lat], zoom: 10 });
    }
  }
}
