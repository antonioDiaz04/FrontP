import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { RutaService } from "../../../../../shared/services/ruta.service";
import { Ruta } from "../../../../../shared/interfaces/ruta.interface";
import { Toast } from "../../../../../shared/services/toast.service";
import { Table } from "primeng/table";

@Component({
  selector: "app-ruta-listado",
  templateUrl: "./ruta-listado.component.html",
  styleUrls: ["../../../tablePrime.scss", "../../../form.scss"],
})
export class RutaListadoComponent implements OnInit {
  @ViewChild("dt2") dt2!: Table;
  allRutas: Ruta[] = [];
  paginatedRutas: Ruta[] = [];
  selectedRuta: Ruta | null = null;
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;

  constructor(
    private rutaS: RutaService,
    private toast: Toast,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerRutas();
    this.updatePaginatedRutas();
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, "contains");
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
