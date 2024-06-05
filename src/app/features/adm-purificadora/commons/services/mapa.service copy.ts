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

  
  latitudLongitudCambiadas: EventEmitter<{ latitud: number, longitud: number }> = new EventEmitter();

  
  
  setUbicaciones(ubicaciones: { longitud: string, latitud: string }[]) {
    this.ubicacionesSubject.next(ubicaciones);
    console.log("llega a servicio seUbicaciones ", ubicaciones)
    this.addMarkers(ubicaciones);
  }

  ngOnInit(): void {
    this.buildMap();
  }

  mapbox = (mapboxgl as typeof mapboxgl)

  map!: mapboxgl.Map;


  cbAddress: EventEmitter<any> = new EventEmitter<any>();

  style = 'mapbox://styles/mapbox/satellite-streets-v12'
  lat = 21.096391850541213;
  lng = -98.46080933099502;
  zoom = 15;
  //coordenadas de hidalgo: 21.096391850541213, -98.46080933099502
  constructor() {
    // this.mapbox.accessToken = environment.mapPk;
    console.log(environment.mapPk)
  }



  buildMap(): Promise<any> {
    // todo aqui construimos el mapa
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          accessToken: environment.mapPk,
          container: 'map',
          style: this.style,
          zoom: this.zoom,
          center: [this.lng, this.lat]
        })
        // aqui empieza la de geolocalizacion
        this.map.addControl(new mapboxgl.NavigationControl()); // input de zoom
        this.map.addControl(new mapboxgl.FullscreenControl());
        
        
        this.map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));

        // aqui termina la de geolocalizacion

        resolve({
          map: this.map
        });

        // Update the map when user moves
        this.map.on('geolocate', (position) => {
          const { latitude, longitude } = position.coords;
          this.map.setCenter([longitude, latitude]);
        });



        // aqui termina lo de mostrar coordenadas
        // input buscador de direcciones
        const geocoder = new MapboxGeocoder({
          accessToken: environment.mapPk,
          mapboxgl
        })
        resolve({
          map: this.map,
          geocoder
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  addMarker(lat: number, lng: number) {
    if (this.map) {
      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);
    }
  }

  private addMarkers(ubicaciones: { longitud: string, latitud: string }[]) {
    if (this.map) {
      ubicaciones.forEach(punto => {
        const lat = parseFloat(punto.latitud);
        const lng = parseFloat(punto.longitud);
        if (!isNaN(lat) && !isNaN(lng)) {
          this.addMarker(lat, lng);
        }
      });
    }
  }
}
