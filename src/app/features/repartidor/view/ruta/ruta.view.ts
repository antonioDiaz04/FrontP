import { Component, AfterViewInit } from '@angular/core';
import { MapboxService } from '../../commons/services/mapa.service';
import mapboxgl from 'mapbox-gl';

interface Client {
  name: string;
  coordinates: [number, number];
}

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.view.html',
  styleUrls: ['./ruta.view.css']
})
export class RutaView implements AfterViewInit {
  map!: mapboxgl.Map;
  clients: Client[] = [
    { name: 'Cliente 1', coordinates: [-98.426, 21.14] },
    { name: 'Cliente 2', coordinates: [-98.423, 21.141] },
    { name: 'Cliente 3', coordinates: [-98.429, 21.135] }
  ];

  constructor(private mapboxService: MapboxService) { }

  ngAfterViewInit(): void {
    this.initializeMap();
  }


  
  initializeMap(): void {
    // Obtener la ubicación del usuario si es posible
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation: [number, number] = [position.coords.longitude, position.coords.latitude];
      
      // Inicializar el mapa centrado en la ubicación del usuario
      this.map = this.mapboxService.getMap('map', userLocation, 12);

      // Agregar marcadores y trazar rutas
      this.addMarkers();
      this.drawRoutesFromUserLocation(userLocation);
    }, () => {
      console.error('No se pudo obtener la ubicación del usuario');
      
      // Inicializar el mapa sin ubicación del usuario si falla la geolocalización
      this.map = this.mapboxService.getMap('map', [-98.426, 21.14], 12);

      // Agregar marcadores solamente
      this.addMarkers();
    });
  }

  addMarkers(): void {
    this.clients.forEach(client => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundSize = '100%';

      new mapboxgl.Marker(el)
        .setLngLat(client.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(client.name))
        .addTo(this.map);
    });
  }

  async drawRoutesFromUserLocation(userLocation: [number, number]): Promise<void> {
    this.clearRoutes();

    for (let i = 0; i < this.clients.length; i++) {
      const end = this.clients[i].coordinates;
      const route = await this.mapboxService.getRoute(userLocation, end);

      this.map.addLayer({
        id: `route-${i}`,
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route
            }
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#888',
          'line-width': 8
        }
      });
    }
  }

  clearRoutes(): void {
    const routeLayers = this.map.getStyle().layers.filter(layer => layer.id.startsWith('route-'));
    routeLayers.forEach(layer => {
      if (this.map.getLayer(layer.id)) {
        this.map.removeLayer(layer.id);
      }
      if (this.map.getSource(layer.id)) {
        this.map.removeSource(layer.id);
      }
    });
  }
}
