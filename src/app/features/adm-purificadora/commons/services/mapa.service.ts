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

  
  
  setUbicaciones(ubicaciones: { longitud: string, latitud: string }[]) {
    this.ubicacionesSubject.next(ubicaciones);
    console.log("llega a servicio seUbicaciones ", ubicaciones)
    // this.addMarkers(ubicaciones); 
    this.updateMarkers(ubicaciones); 
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
// geolocalizacion
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.lng = position.coords.longitude;
               this.lat = position.coords.latitude;
              this.map.setCenter([this.lng, this.lat]);

              // Añadir marcador en la ubicación actual
              const marker = new mapboxgl.Marker()
                .setLngLat([this.lng,this.lat])
                .addTo(this.map)
                .setPopup(new mapboxgl.Popup().setHTML('Estás aquí'));

              // Guardar el marcador en el mapa
              this.markers.set('current-location', marker);
            },
            (error) => {
              console.error('Error al obtener la ubicación: ', error);
            },
            { enableHighAccuracy: true }
          );
        } else {
          console.log("La geolocalización no está disponible");
        }
        // aqui termina la de geolocalizacion

        resolve({ map: this.map });
        
        
        
        // // Update the map when user moves
        // this.map.on('geolocate', (position) => {
        //   const { latitude, longitude } = position.coords;
        //   this.map.setCenter([longitude, latitude]);
        // });



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
    const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);
    const key = `${lat}-${lng}`;
    this.markers.set(key, marker); // Añadimos el marcador al Map usando las coordenadas como clave
  }

  removeMarkersNotInList(ubicaciones: { longitud: string, latitud: string }[]) {
    // Obtener las claves de los marcadores actuales
    const currentMarkerKeys = Array.from(this.markers.keys());

    // Obtener las claves de las ubicaciones nuevas
    const newMarkerKeys = ubicaciones.map(p => `${p.latitud}-${p.longitud}`);

    // Encontrar marcadores que ya no están presentes en las nuevas ubicaciones y eliminarlos
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
    // Limpiar marcadores que ya no están presentes
    this.removeMarkersNotInList(ubicaciones);

    // Añadir nuevos marcadores según las nuevas ubicaciones
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

}
