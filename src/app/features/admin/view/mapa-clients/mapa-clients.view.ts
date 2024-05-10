import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MapaService } from '../../../../shared/services/mapa.service';
// import * as mapboxgl from '@mapbox/mapbox-gl-js';
@Component({
  selector: 'app-mapa-clients',
  templateUrl: './mapa-clients.view.html',
  styleUrl: './mapa-clients.view.css',
  encapsulation: ViewEncapsulation.None
})
export class MapaClientsView implements OnInit{

        // mapboxgl.accessToken = 'pk.eyJ1IjoibmljMjMzMzMyIiwiYSI6ImNsdnc4emFrdjI1cDEyaW8wM2c3eHBzOXcifQ.1-puGhsFZFr7T_lU3f1nqQ'; // Reemplaza TU_TOKEN_DE_MAPBOX con tu propio token de Mapbox

  constructor(private mapService: MapaService){}

  ngOnInit(): void {
    this.mapService.buildMap()
      .then((data) => {
      
        console.log('Perfecto |', data);
      })
    .catch((err)=>{

      console.log('Error *** ', err);
    })
}
  
}
