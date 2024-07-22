import { Component, ViewEncapsulation } from "@angular/core";
import { ClientesService } from "../../../../shared/services/clientes.service";
import { Cliente } from "../../../../shared/interfaces/client.interface";
import { RepartidoresService } from "../../../../shared/services/rapartidores.service";
import { Repartidor } from "../../../../shared/interfaces/repartidor.interface";

@Component({
  selector: "app-adm-dashboard",
  templateUrl: "./adm-dashboard.view.html",
  styleUrl: "./adm-dashboard.view.scss",
  encapsulation: ViewEncapsulation.None,
})
export class AdmDashboardView {
  date: Date[] | undefined;
  basicData: any;

  basicOptions: any;
  nombre: string = "Andrea";
  ngOnInit() {
    this.getUsers();
    this.getRepartidores();

    if (typeof document !== "undefined") {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");
      const textColorSecondary = documentStyle.getPropertyValue(
        "--text-color-secondary"
      );
      const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

      this.basicData = {
        labels: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        datasets: [
          {
            label: "Ventas",
            data: [540, 325, 702, 620, 450, 380, 510, 460, 620, 700, 750, 800], // Ejemplo de datos de ventas para cada mes
            backgroundColor: [
              "rgba(255, 159, 64, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: [
              "rgb(255, 159, 64)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(255, 206, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
            ],
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };
    }
  }
  allClients: Cliente[] = [];
  allRepartidores: Repartidor[] = [];

  constructor(
    private UserS: ClientesService,
    private repService: RepartidoresService
  ) {}

  getUsers() {
    this.UserS.obtenerCLientes().subscribe(
      (data: Cliente[]) => {
        this.allClients = data;
      },
      (error) => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }
  getRepartidores() {
    this.repService.getRepartidores().subscribe(
      (data) => {
        this.allRepartidores = data;
      },
      (error) => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }
}
