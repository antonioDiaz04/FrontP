import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { RutaService } from "../../../../../shared/services/ruta.service";
import { Ruta } from "../../../../../shared/interfaces/ruta.interface";
import { Toast } from "../../../../../shared/services/toast.service";
import { Table } from "primeng/table";
import { Cliente } from "../../../../../shared/interfaces/client.interface";
import { Salida } from "../../../../../shared/models/salida.model";

// import QRCode from 'qrcode';
//

// requerimientos
// import { Component } from '@angular/core';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
// import QRCode from "@zxing/library/esm/core/qrcode/encoder/QRCode";
// import QRCode from 'qrcode';
export interface PuntoDeEntrega {
  clienteId?: Cliente;
  clientePresente?: boolean;
  cantidadEntregada?: number;
  _id: string;
}
@Component({
  selector: "app-ruta-listado",
  templateUrl: "./ruta-listado.component.html",
  styleUrls: ["../../../tablePrime.scss", "../../../form.scss"],
})
export class RutaListadoComponent implements OnInit {
  @ViewChild("dt2") dt2!: Table;
  @Input() data!: any; // data es un array de Salida

  allRutas: Ruta[] = [];
  paginatedRutas: Ruta[] = [];
  selectedRuta: Ruta | null = null;
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;
  name: string = "";
  clientes: any[] = [];
  //
  visible: boolean = false;
  listClientes: Cliente[] | any;

  // public myAngularxQrCode: string;
  allclt: PuntoDeEntrega[] = [];
  constructor(
    private rutaS: RutaService,
    private toast: Toast,
    private router: Router
  ) {}

  // clientes = [
  //   { nombre: 'Nico Antonio', id: 1 },
  //   { nombre: 'Ana Perez', id: 2 },
  //   { nombre: 'Juan Lopez', id: 3 },
  //   { nombre: 'Juan Lopez', id: 3 },
  //   { nombre: 'Juan Lopez', id: 3 },
  //   { nombre: 'Juan Lopez', id: 3 },
  //   { nombre: 'Juan Lopez', id: 3 },
  //   { nombre: 'Juan Lopez', id: 3 },
  //   { nombre: 'Juan Lopez', id: 3 },
  //   { nombre: 'Juan Lopez', id: 3 },
  //   { nombre: 'Juan Lopez', id: 3 },
  //   { nombre: 'Juan Lopez', id: 3 },
  //   // Agrega más clientes según sea necesario
  // ];

  ngOnInit(): void {
    this.obtenerRutas();
    this.updatePaginatedRutas();
  }
  generarPDF() {
    const pdf = new jsPDF();
    const dataElement = document.getElementById("qr-container");

    if (dataElement) {
      html2canvas(dataElement)
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          // Verifica que imgData es una cadena válida en base64
          if (imgData && imgData.startsWith("data:image/")) {
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("qrs.pdf");
          } else {
            console.error(
              "El formato de la imagen no es soportado o no es válido."
            );
          }
        })
        .catch((error) => {
          console.error("Error al generar la imagen con html2canvas:", error);
        });
    } else {
      console.error("El elemento con id 'qr-container' no fue encontrado.");
    }
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, "contains");
  }
  filterText:string=''
highlightText(text: string): string {
  console.log(`El tipo de dato de 'text' es: ${typeof text}`); // Esto mostrará el tipo de dato de 'text' en la consola.

  if (!this.filterText) {
    return text; // Si no hay texto a filtrar, regresa el texto original.
  }

  const regex = new RegExp(`(${this.filterText})`, 'gi'); // Crea una expresión regular para encontrar el texto de búsqueda.
  return text.replace(regex, '<mark>$1</mark>'); // Reemplaza las coincidencias con el texto envuelto en <mark>.
}

  obtenerRutas() {
    this.rutaS.getRutas().subscribe(
      (data) => {
        this.allRutas = data;
        this.totalRecords = this.allRutas.length;

        this.updatePaginatedRutas();
      },
      (error) => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

  getData(id: string): void {
    console.log("aquI");
    if (id) {
      this.rutaS.detalleRutaById(id).subscribe(
        (data) => {
          // data es un objeto, no un array
          this.data = data;
          console.log(this.data.nombreRuta)
this.name=this.data.nombreRuta


          // Asegúrate de que puntosDeEntrega es un array antes de mapearlo
          if (data.puntosDeEntrega && Array.isArray(data.puntosDeEntrega)) {
            const clientes = data.puntosDeEntrega.map(
              (entrega: PuntoDeEntrega) => entrega
            );
            console.log(this.listClientes);
            this.listClientes = clientes;
            this.visible = true;
          } else {
            console.log("No hay puntos de entrega disponibles para esta ruta.");
          }
        },
        (error) => {
          console.error("Error al actualizar el usuario:", error);
        }
      );
    }
  }

  eliminarRuta(id: any, nombre: any) {
    this.rutaS.eliminarRuta(id).subscribe(
      (data) => {
        this.toast.showToastPmNgSecondary(
          `Se eliminó correctamente la ruta ${nombre} del sistema.`
        );
        this.obtenerRutas();
      },
      (error) => {
        console.log("ocurrio un error", error);
      }
    );
  }

  detalleById(id: any) {
    this.router.navigate([`/purificadoraAdm/ruta/detalleByIdRutaFrom/${id}`]);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedRutas();
  }

  updatePaginatedRutas() {
    this.paginatedRutas = this.allRutas.slice(
      this.first,
      this.first + this.rows
    );
  }

  redirecTo(route: string): void {
    this.router.navigate(["/purificadoraAdm/ruta/", route]);
  }

  editar(_id: any) {
    this.router.navigate([`/purificadoraAdm/ruta/editarByIdRutaFrom/${_id}`]);
  }
}
