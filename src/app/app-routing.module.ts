import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  {
    path: "",
    redirectTo: "public",
    pathMatch: "full",
  },
  {
    path: "public", // NOTE: modulo publica de aplicacion web
    loadChildren: () =>
      import("./features/public/public.module").then((m) => m.PublicModule),
  },
  {
    path: "admin", // NOTE: modulo principal del administrador de la pagina en la aplicacion web
    loadChildren: () =>
      import("./features/admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "purificadoraAdm", // NOTE: modulo principal del administrador de la purifcadora en la aplicacion web
    loadChildren: () =>
      import("./features/adm-purificadora/adm-purificadora.module").then(
        (m) => m.AdmPurificadoraModule
      ),
  },
  {
    path: "repartidor", // NOTE: modulo principal del repartidor en la  aplicacion web
    loadChildren: () =>
      import("./features/repartidor/repartidor.module").then(
        (m) => m.RepartidorModule
      ),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/auth.module").then((m) => m.AuthModule),
  },

  // {
  //   title: "404",
  //   path: 'not-found',
  //   // component: NotFoundView,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
