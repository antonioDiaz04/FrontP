import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../../../../shared/services/clientes.service';
import { Cliente } from '../../../../shared/interfaces/client.interface';

@Component({
  selector: 'app-cliente-tabla',
  templateUrl: './clientes.view.html',
  styleUrls: ['./clientes.view.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClientesView implements OnInit {
  listUsuario?: Cliente;
  idCliente!: string;
  id!: string | null;

  clienteForm!: FormGroup;

  allClients: Cliente[] = [];
  paginatedClients: Cliente[] = [];
  totalRecords: number = 0;
  rows: number = 5; // Número de registros por página
  first: number = 0; // Índice del primer registro de la página actual

  visible: boolean = false;
  isVisible = false;

  @ViewChild('asGeocoder') asGeocoder!: ElementRef;

  constructor(
    private render2: Renderer2,
    private fb: FormBuilder,
    private UserS: ClientesService,
    private router: ActivatedRoute,
    private rou: Router
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      estatus: ['', Validators.required],
      numCasa: ['', Validators.required],
      telefono: ['', Validators.required],
    });
    this.id = this.router.snapshot.paramMap.get('id');
  }
  showScanner = false;
  scannedData!: string;
  ngOnInit(): void {
    this.getUsers();
    this.updatePaginatedClients();
  }

  redirectToAdmin(route: string): void {
    console.log(route)
    if (route === 'login') {
      this.rou.navigate(['/auth/login'])
    } else {
      this.rou.navigate(['/purificadoraAdm', route])
    }
  }

  editar(id: any) {
    this.visible = true;
    this.idCliente = this.router.snapshot.params['id'];
    if (id !== null) {
      this.UserS.detalleClienteById(id).subscribe((data) => {
        this.listUsuario = data;
        this.clienteForm.setValue({
          nombre: data.nombre,
          email: data.email,
          estatus: data.estatus,
          numCasa: data.numCasa,
          telefono: data.telefono
        });
      });
    }
  }

  actualizarCliente(id: any) {
    if (this.clienteForm.valid) {
      this.UserS.updateUsuario(id, this.clienteForm.value)
        .subscribe(response => {
          this.getUsers();
          this.visible = false;
          console.log('Usuario actualizado:', response);
        }, error => {
          console.error('Error al actualizar el usuario:', error);
        });
    }
  }

  getUsers() {
    this.UserS.obtenerCLientes().subscribe(
      data=> {
        this.allClients = data;
        this.totalRecords = this.allClients.length;
        this.updatePaginatedClients();
      },
      error => {
        console.log("ocurrió un error al obtener la información", error);
      }
    );
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedClients();
  }

  updatePaginatedClients() {
    this.paginatedClients = this.allClients.slice(this.first, this.first + this.rows);
  }

  eliminarUsuario(id: any) {
    this.UserS.eliminarCliente(id).subscribe(data => {
      console.log("eliminado")
      this.getUsers();
    }, error => {
      console.log("ocurrio un error", error)
    })
  }

  // Función para redireccionar al formulario nuevo
  redireccionar() {
    this.rou.navigateByUrl('repartidor/Opciones');
  }
  escanearQR(route:any) {
    this.showScanner = true;

    this.rou.navigate(['/repartidor', route])
  }

  closeScanner() {
    this.showScanner = false;
  }

  handleQrCodeResult(result: string): void {
    this.scannedData = result;
    console.log('Scanned QR Code Data:', result);
    this.closeScanner();
  }


  verRuta(cliente: any) {
    // Lógica para ver ruta
    console.log('Ver ruta de', cliente.nombre);
  }
}
