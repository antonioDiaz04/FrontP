import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClienteFormComponent } from "./commons/components/cliente-form/cliente-form.component";
import { ControlEntregasView } from "./view/control-entregas/control-entregas.view";
import { InicioView } from "./view/inicio/inicio.view";
import { AdmPurificadoraComponent } from "./adm-purificadora.component";
import { AdmHomeView } from "./view/adm-home/adm-home.view";
import { RepartidoresFormComponent } from "./commons/components/repartidores-form/repartidores-form.component";
import { RepartidoresListadoComponent } from "./commons/components/repartidores-listado/repartidores-listado.component";
import { RepartidoresView } from "./view/repartidores/repartidores.view";
import { RutaView } from "./view/ruta/ruta.view";
import { RutaFormComponent } from "./commons/components/ruta-form/ruta-form.component";
import { RutaListadoComponent } from "./commons/components/ruta-listado/ruta-listado.component";
import { VehiculosView } from "./view/vehiculos/vehiculos.view";
import { VehiculoFormComponent } from "./commons/components/vehiculo-form/vehiculo-form.component";
import { VehiculoListadoComponent } from "./commons/components/vehiculo-listado/vehiculo-listado.component";
import { ClienteTablaComponent } from "./commons/components/cliente-tabla/cliente-tabla.component";
import { RutaDetalleComponent } from "./commons/components/ruta-detalle/ruta-detalle.component";
import { SalidaView } from "./view/salida/salida.view";
import { EntradaView } from "./view/entrada/entrada.view";
import { SalidaListaComponent } from "./commons/components/salida-lista/salida-lista.component";
import { EntradaEditComponent } from "./commons/components/entrada-edit/entrada-edit.component";
import { EntradaListaComponent } from "./commons/components/entrada-lista/entrada-lista.component";
import { NotificacionesView } from "./view/notificaciones/notificaciones.view";
import { ResultadoEntregaView } from "./view/resultado-entrega/resultado-entrega.view";
import { ResultadosListadoComponent } from "./commons/components/resultados-listado/resultados-listado.component";
import { MiPerfilView } from "./view/mi-perfil/mi-perfil.view";
import { AsignarClientesRutaComponent } from "./commons/components/asignar-clientes-ruta/asignar-clientes-ruta.component";
import { HistorialEntregaComponent } from "./commons/components/historial-entrega/historial-entrega.component";
import { QrGnerarPdfComponent } from "./commons/components/qr-gnerar-pdf/qr-gnerar-pdf.component";
import { ClienteListadoComponent } from "./commons/components/cliente-listado/cliente-listado.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "purificadoraAdm/Home",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdmPurificadoraComponent,
    children: [
      {
        path: "Home",
        component: InicioView,
      },
      {
        path: "admin-home",
        component: AdmHomeView,
      },
      {
        path: "cliente",
        component: ControlEntregasView,
        children: [
          {
            path: "lista-clientes",
            component: ClienteListadoComponent,
          },
          {
            path: "agregar-cliente",
            component: ClienteFormComponent,
          },
          {
            path: "",
            redirectTo: "lista-clientes",
            pathMatch: "full",
          },
        ],
      },
      {
        path: "QrClients",
        component: QrGnerarPdfComponent,
      },
      {
        path: "miPerfil",
        component: MiPerfilView,
      },
      {
        path: "salida",
        component: SalidaView,
        children: [
          {
            path: "salida-listado",
            component: SalidaListaComponent,
          },
          {
            path: "",
            redirectTo: "salida-listado",
            pathMatch: "full",
          },
        ],
      },
      {
        path: "resultado",
        component: ResultadoEntregaView,
        children: [
          {
            path: "resultadoListadoEntrega",
            component: ResultadosListadoComponent,
          },
          {
            path: "",
            redirectTo: "resultadoListadoEntrega",
            pathMatch: "full",
          },
        ],
      },
      {
        path: "entrada",
        component: EntradaView,
        children: [
          {
            path: "edit-entrada/:id",
            component: EntradaEditComponent,
          },
          {
            path: "entrada-listado",
            component: EntradaListaComponent,
          },
          {
            path: "",
            redirectTo: "entrada-listado",
            pathMatch: "full",
          },
        ],
      },
      {
        path: "historial-entrega",
        component: HistorialEntregaComponent,
      },
      {
        path: "notificaciones",
        component: NotificacionesView,
      },
      {
        path: "repartidore",
        component: RepartidoresView,
        children: [
          {
            path: "agregar-repartidor",
            component: RepartidoresFormComponent,
          },
          {
            path: "lista-repartidores",
            component: RepartidoresListadoComponent,
          },
          {
            path: "", // Ruta por defecto dentro de repartidores (opcional)
            redirectTo: "lista-repartidores", // Redirigir a lista-repartidores por defecto
            pathMatch: "full",
          },
        ],
      },
      {
        path: "vehiculo",
        component: VehiculosView,
        children: [
          {
            path: "agregar-vehiculo",
            component: VehiculoFormComponent,
          },
          {
            path: "lista-vehiculo",
            component: VehiculoListadoComponent,
          },
          {
            path: "", // Ruta por defecto dentro de repartidores (opcional)
            redirectTo: "lista-vehiculo", // Redirigir a lista-repartidores por defecto
            pathMatch: "full",
          },
        ],
      },
      {
        path: "repartidor",
        component: RepartidoresView,
        children: [
          {
            path: "agregar-repartidor",
            component: RepartidoresFormComponent,
          },
          {
            path: "lista-repartidores",
            component: RepartidoresListadoComponent,
          },
          {
            path: "",
            redirectTo: "lista-repartidores",
            pathMatch: "full",
          },
        ],
      },
      {
        path: "ruta",
        component: RutaView,
        children: [
          {
            path: "agregar-ruta",
            component: RutaFormComponent,
          },
          {
            path: "lista-rutas",
            component: RutaListadoComponent,
          },
          {
            path: "asignar-clientes-ruta",
            component: AsignarClientesRutaComponent,
          },
          {
            path: "editarByIdRutaFrom/:id",
            component: RutaFormComponent,
          },
          {
            path: "detalleByIdRutaFrom/:id",
            component: RutaDetalleComponent,
          },

          {
            path: "",
            redirectTo: "lista-rutas",
            pathMatch: "full",
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmPurificadoraRoutingModule {}
