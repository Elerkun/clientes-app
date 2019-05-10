import { Component, OnInit } from '@angular/core';
import {Clientes} from '../clientes';
import {ClientesService} from '../clientes.service';
import {ActivatedRoute} from '@angular/router'
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  cliente: Clientes;
  titulo : string ="Detalle del cliente";
  private fotoselecionada : File;
  progreso: number=0
  constructor(private clientesService: ClientesService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params =>{
       let id:number = +params.get('id');
       if(id){
         this.clientesService.getClientes_byId(id).subscribe(cliente =>{
           this.cliente = cliente;
         })
       }
    });

   }
  uploadFoto(event){
    this.fotoselecionada = event.target.files[0];
    this.progreso= 0;
    console.log(this.fotoselecionada);
    if(this.fotoselecionada.type.indexOf('image')<0){
      swal.fire('Error', 'El archivo debe ser una imagen','error');
           this.fotoselecionada = null;
    }

  }
  subirFoto(){
    if(!this.fotoselecionada){
      swal.fire('Error', 'Seleccione una foto','error');
    }else{
    this.clientesService.upload(this.fotoselecionada, this.cliente.id)
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Clientes;
          swal.fire('La foto se ha subido correctamente!', response.mensaje,'success');
        }

      });
  }
}

}
