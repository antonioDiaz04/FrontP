import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { EventEmitter, Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { resolve } from 'path';
import { rejects } from 'assert';
import { environment } from '../../../environments/environment';
// import EventEmitter from 'events';
// import { environment } from '../../../environments/environment.prod';
// import MapboxGeocoder  from '@mapbox/mapbox-gl-MapboxGeocoder';


@Injectable({
  providedIn: 'root'
})
export class MapaService {

  mapbox = (mapboxgl as typeof mapboxgl)

  map!: mapboxgl.Map;


  cbAddress: EventEmitter<any> = new EventEmitter<any>();

  style = 'mapbox://styles/mapbox/satellite-streets-v12'
  lat = 21.096391850541213;
  lng = -98.46080933099502;
  zoom = 4;

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
        // Maneja el evento mousemove
        this.map.on('mousemove', (e) => {
          const coordenadasElement = document.getElementById('coordenadas');
          if (coordenadasElement) {
            coordenadasElement.innerHTML = JSON.stringify(e.lngLat);

          
          }

        });

        // Maneja el evento click,con esto agregaremos el marcador
        this.map.on('click', (e) => {
          // Obtener latitud y longitud del evento de clic
          const latitud = e.lngLat.lat;
          const longitud = e.lngLat.lng;

            console.log("long:",longitud, "lat:", latitud)
          // Agregar marcador al mapa en la posición del clic
          const marker = new mapboxgl.Marker()
            .setLngLat([longitud, latitud])
            .addTo(this.map);
        });

        // aqui lo que haremos es hacer que reconozca en tiempo real nuestra ubicacion actual
        
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
}
