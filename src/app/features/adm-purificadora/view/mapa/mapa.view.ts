import { Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MapaService } from '../../../../shared/services/mapa.service';

import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.view.html',
  styleUrl: './mapa.view.css',
  encapsulation: ViewEncapsulation.None
})
export class MapaView {

  @ViewChild('asGeocoder') asGeocoder!: ElementRef;



  constructor(private clipboardService: ClipboardService,private mapService: MapaService, private render2: Renderer2) { }

  ngOnInit(): void {
    this.mapService.buildMap()
      .then(({ geocoder, map }) => {
        this.render2.appendChild(this.asGeocoder.nativeElement, geocoder.onAdd(map));
        console.log('Perfecto |');
      })
      .catch((err) => {
        console.log('Error *** ', err);
      });
    this.mapService.cbAddress.subscribe((getPoint)=> {
      
      console.log('*** getPoint', getPoint)
    })
  }


  // copiarClave() {
  //   console.log("hola mundo copy")
  //   // Obtener el valor del input
  //   const coordenadasCopy = document.getElementById('coordenadas') as HTMLInputElement;
  //   coordenadasCopy.select();
  //   document.execCommand('copy');
  // }


  copiarClave() {
    console.log("hola mundo copy");
    const coordenadasElement = document.getElementById('coordenadas');
    if (coordenadasElement) {
      const coordenadasCopy = coordenadasElement.innerText;
      this.clipboardService.copyFromContent(coordenadasCopy);
    } else {
      console.error("Elemento con ID 'coordenadas' no encontrado.");
    }
  }

}
