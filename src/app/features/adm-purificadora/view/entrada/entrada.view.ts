import { Component } from '@angular/core';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.view.html',
  styleUrls: ['../../adm-purificadora.component.scss']
})
export class EntradaView {
 deliveries = [
    {
      route: 'Ruta 1',
      scheduledDate: '2024-06-10',
      vehicle: 'Vehículo A',
      deliveryPerson: 'Juan Pérez',
      outQuantity: 100,
      inQuantity: 98,
      status: 'Entregado'
    },
    {
      route: 'Ruta 2',
      scheduledDate: '2024-06-11',
      vehicle: 'Vehículo B',
      deliveryPerson: 'María Gómez',
      outQuantity: 200,
      inQuantity: 200,
      status: 'Pendiente'
    }
    // Puedes agregar más entregas de ejemplo aquí
  ];

  viewDetails(delivery: any) {
    // Aquí puedes implementar la lógica para ver los detalles de la entrega
    console.log('Detalles de la entrega:', delivery);
  }


  
}
