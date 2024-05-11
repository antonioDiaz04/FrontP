import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { resolve } from 'path';
import { rejects } from 'assert';
import { environment } from '../../../environments/environment';
// import { environment } from '../../../environments/environment.prod';
// import MapboxGeocoder  from '@mapbox/mapbox-gl-MapboxGeocoder';


@Injectable({
  providedIn: 'root'
})
export class MapaService {

  mapbox = (mapboxgl as typeof mapboxgl)

  map!: mapboxgl.Map;


  style = 'mapbox://styles/mapbox/streets-v12'
  lat = 21.096391850541213;
  lng = -98.46080933099502;
  zoom = 5;



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
        // input de zoom
        this.map.addControl(new mapboxgl.NavigationControl)

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
