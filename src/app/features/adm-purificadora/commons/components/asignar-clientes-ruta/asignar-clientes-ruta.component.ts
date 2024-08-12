import { Component, OnInit } from "@angular/core";
import { RutaService } from "../../../../../shared/services/ruta.service";
import { ClientesService } from "../../../../../shared/services/clientes.service";
import { FormControl } from "@angular/forms";
import { Cliente } from "../../../../../shared/interfaces/client.interface";

interface Column {
  field: string;
  header: string;
}
interface ColoniaOption {
  label: string;
  value: string;
}


interface ClientData {
  nombre: string;
  colonia: string;
  municipio: string;
}

@Component({
  selector: "app-asignar-clientes-ruta",
  templateUrl: "./asignar-clientes-ruta.component.html",
  styleUrls: ["./asignar-clientes-ruta.component.css"],
})
export class AsignarClientesRutaComponent implements OnInit {
  rutas: any[] = [];
  allDatos: { [municipio: string]: { [colonia: string]: string[] } } = {};
  selectedRuta: any; // Asegúrate de definir la propiedad selectedRuta
 selectedColonias: ColoniaOption[] = [];

  filteredClients: ClientData[] = [];
  columnsControl = new FormControl();
  rutaControl = new FormControl();
  coloniasOptions: any[] = [];
  allClients!:any;
  tabs: { title: string; content: string }[] = [];
 activeIndex: number = 0;

    selectedCliente!: Cliente;

    scrollableTabs: any[] = Array.from({ length: 2 }, (_, i) => ({ title: "Title", content: "Content" }));

  constructor(
    private rutaService: RutaService,
    private clientesService: ClientesService
  ) {}

  ngOnInit() {
    this.getColoniasYClientes();
    this.getRutas();
    this.rutaControl.valueChanges.subscribe((value) => {
      this.selectedRuta = value;
      this.filterClients();
    });
    this.getUsers()
  }

  getRutas() {
    this.rutaService.getRutas().subscribe(
      (data) => {
        this.rutas = data;
      },
      (error) => {
        console.log("Error al obtener rutas", error);
      }
    );
  }

  getColoniasYClientes() {
    this.clientesService.obtenerColoniasYclientes().subscribe((data) => {
      this.allDatos = data;
      this.processColoniasData();
    });
  }

  processColoniasData() {
    this.coloniasOptions = Object.entries(this.allDatos).flatMap(
      ([municipio, colonias]) =>
        Object.keys(colonias).map((colonia) => ({
          label: colonia,
          value: colonia,
        }))
    );
  }
filterClients() {
  if (this.selectedRuta && this.selectedColonias.length > 0) {
    const municipio = this.selectedRuta.municipio; // Asegúrate de que 'municipio' sea parte de 'selectedRuta'

    // Extrae las etiquetas de las colonias seleccionadas
    const colonias = this.selectedColonias.map((coloniaObj: any) =>
      typeof coloniaObj === 'object' && coloniaObj.hasOwnProperty('label')
      ? coloniaObj.label
      : coloniaObj
    );

    // Filtra los clientes basándose en las colonias seleccionadas
    this.filteredClients = this.allDatos[municipio]
      ? Object.entries(this.allDatos[municipio]).flatMap(
          ([colonia, clients]) =>
            colonias.includes(colonia)
              ? clients.map((client) => ({
                  municipio,
                  colonia,
                  nombre: client,
                }))
              : []
        )
      : [];
    this.updateTabs();
  }
}
updateTabs() {
  if (this.selectedRuta) {
    this.tabs = this.selectedColonias.map((coloniaObj: any) => {
      // Asegúrate de que coloniaObj sea un objeto con una propiedad `label`
      const coloniaLabel = typeof coloniaObj === 'object' && coloniaObj.hasOwnProperty('label')
        ? coloniaObj.label
        : coloniaObj; // Fallback si coloniaObj no es un objeto o no tiene label

      // Filtra los clientes para la colonia específica
      const clientsInColonia = this.filteredClients
        .filter((client) => client.colonia === coloniaLabel)
        .map((client) => client.nombre)
        .join(", ");

      return {
        title: `${this.selectedRuta.nombreRuta} - ${coloniaLabel}`,
        content: clientsInColonia || `No clients available in ${coloniaLabel}`,
      };
    });
  }
}

 getUsers() {
    this.clientesService.obtenerCLientes().subscribe(
      (data: Cliente[]) => {
        this.allClients = data;
      },
      (error) => {
        console.log('ocurrió un error al obtener la información', error);
      }
    );
  }



}
