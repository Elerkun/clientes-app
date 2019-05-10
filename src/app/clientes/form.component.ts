import { Component, OnInit } from '@angular/core';
import {Clientes} from './clientes';
import {ClientesService} from './clientes.service';
import {Router,ActivatedRoute} from '@angular/router'; //activatedRoute: sirve para encontrar el 'id del cliente', que de forma automatica asigna los datos al objeto 'cliente'
import swal from 'sweetalert2';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  private cliente: Clientes = new Clientes();
  //private titulo:string = "Crear cliente";
 private errores : string[];

  constructor(private clientesService: ClientesService, private router: Router, private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    this.cargarCliente_byId();
  }

  public create():void{
    this.clientesService.create(this.cliente).subscribe(cliente => {
      this.router.navigate(['/clientes'])
      swal.fire('Cliente Nuevo', ` El cliente ha sido creado ${cliente.nombre} con exito! `, 'success');
      },
      err => {
        this.errores = err.error.mensaje as string[];

      }
    );
  }
  public cargarCliente_byId(): void{
    this.activatedRoute.params.subscribe(params => {
      let id= params['id'];
      if(id){
        this.clientesService.getClientes_byId(id).subscribe((cliente)=> this.cliente= cliente)
      }
    })

  }
  public update():void{
    this.clientesService.update(this.cliente).subscribe(json=> {
      this.router.navigate(['/clientes'])
      swal.fire('Cliente Actualizado', ` ${json.mensaje} ${json.cliente.nombre}`,'success');
    })
  }


}
