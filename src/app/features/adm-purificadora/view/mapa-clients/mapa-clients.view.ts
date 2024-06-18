import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MapaService } from '../../../../shared/services/mapa.service';
@Component({
  selector: 'app-mapa-clients',
  templateUrl: './mapa-clients.view.html',
  styleUrls: ['./mapa-clients.view.scss','./card.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapaClientsView implements OnInit {

  @ViewChild('asGeocoder') asGeocoder!: ElementRef;



  constructor(private mapService: MapaService,private  render2:Renderer2) { }

  ngOnInit(): void {
    this.mapService.buildMap()
      .then(({ geocoder, map }) => {
        this.render2.appendChild(this.asGeocoder.nativeElement, geocoder.onAdd(map));
        console.log('Perfecto |');
      })
      .catch((err) => {
        console.log('Error *** ', err);
      });
  }



  
}
