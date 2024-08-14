import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit {
    latitude!: number;
  longitude!: number;
  mapaUrl: SafeResourceUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer
  ) {
    this.mapaUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
  `https://www.google.com/maps?q=${this.latitude},${this.longitude}`
    );

  }
  // <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d516.1995738598966!2d${this.longitude}!3d${this.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d6df227ee332a5%3A0x972daf246320f21d!2s43047%20La%20Ilusi%C3%B3n%2C%20Hgo.!5e0!3m2!1ses!2smx!4v1723571827828!5m2!1ses!2smx" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  // this.mapaUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29772.43485720334!2d${this.longitude}!3d${this.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2smx!4v1723568184586!5m2!1ses!2smx`);

  ngOnInit(){
    this.activatedRoute.paramMap.subscribe((params:any) => {
      this.latitude = +params.get('latitud')!;
      this.longitude = +params.get('longitud')!;
    });



    console.log(this.longitude)
    console.log(this.latitude)
  }




 // Método para generar la URL dinámica
  // get mapSrc(): string {
  //   return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29772.43485720334!2d${this.longitude}!3d${this.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2smx!4v1723568184586!5m2!1ses!2smx`;
  // }

  // // Método para actualizar las coordenadas
  // updateCoordinates(lat: number, lng: number) {
  //   this.latitude = lat;
  //   this.longitude = lng;
  // }
}
