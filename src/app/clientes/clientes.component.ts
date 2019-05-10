import { Component, OnInit } from '@angular/core';
import {ClientesService} from './clientes.service'
import {Clientes} from './clientes';
import swal from 'sweetalert2';
import {tap} from 'rxjs/operators'
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
//subscribe : toma el valor del Observable y lo asigna a un objeto
export class ClientesComponent implements OnInit {
  clientes: Clientes[];
  paginador:any;
  constructor( private clientesService: ClientesService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //Paginacion
    //paramMap : sirve para poder observar la ruta
    this.activatedRoute.paramMap.subscribe( params => {
       let page: number = +params.get('page'); //parseInt
       if(!page){
          page=0;
       }
       this.clientesService.getClientes(page).pipe(
        tap(response => {
          console.log("ClientesComponent: tap 3");
          (response.content as Clientes[]).forEach(clientes => {
            console.log(clientes.nombre)
            });
          })
        ).subscribe(response => {
          this.clientes = response.content as Clientes[];
          this.paginador = response
        });
     });
  }
  delete(cliente: Clientes): void{
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
  })

  swalWithBootstrapButtons.fire({
    title: 'Estás Seguro?',
    text: `Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si,Eliminar',
    cancelButtonText: 'No, Cancelar!',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      this.clientesService.delete(cliente.id).subscribe(response =>{
        this.clientes = this.clientes.filter(cli => cli !== cliente) //filter: permite filtrar los elementos que deseamos, si el cliente que eliminamos es distinto al que vamos a eliminar lo muestra
        swalWithBootstrapButtons.fire(
          'Cliente Elimiando!',
          `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con exito`,
          'success'
        )
      })

    } else if (
      // Read more about handling dismissals
      result.dismiss === swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelled',
        'Your imaginary file is safe :)',
        'error'
      )
     }
   })
  }
}
