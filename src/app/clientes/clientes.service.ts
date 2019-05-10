import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';

import {HttpClient,HttpHeaders, HttpRequest,HttpEvent} from '@angular/common/http';
import {/*of,*/Observable, throwError} from 'rxjs';
import {map, catchError,tap} from 'rxjs/operators';
import{Clientes} from './clientes';
import swal from 'sweetalert2';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
//pipe : sirve para recoger el error procendente de base datos y poder manejarlo en el cliente
//map : sirve para convertir 'algo' en un objeto que te permita manejar desde el cliente
//Observable : Es la clase que permite transformar todas los flujos de datos para que se puedan manejar
//tap : operador que devuelve un Observable y que nos permite trabajar con el
export class ClientesService {
  private urlEnpoint: string ="http://localhost:8080/api/clientes"
  private HttpHeaders = new HttpHeaders ({'Content-Type': 'application/json'})
  constructor(private http: HttpClient,private router: Router) { }
  //Paginacion
  getClientes(page: number): Observable<any>{
    return this.http.get(this.urlEnpoint + '/page/' + page).pipe(
      tap((response: any) =>{
          console.log("ClientesService: tap 1");
          (response.content as Clientes[]).forEach(
            clientes => {
              console.log(clientes.nombre)
            })
      }),
      map((response: any) => {
         (response.content as Clientes[]).map(clientes => {
          clientes.nombre = clientes.nombre.toUpperCase();
          let datePipe = new DatePipe('es');
          clientes.createAt = datePipe.transform(clientes.createAt, 'EEEE dd, MMMM, yyyy')
          //formatDate(clientes.createAt, 'dd-MM-yyyy', 'en-Us');
          return clientes;
        });
        return response;
      }),
      tap(response =>{
        console.log("ClientesService: tap 2 ");
          (response.content as Clientes[]).forEach(
            clientes => {
              console.log(clientes.nombre)
            })
      }),
    );
  }
  create(cliente:Clientes): Observable<Clientes> {
    return this.http.post(this.urlEnpoint,cliente, {headers : this.HttpHeaders}).pipe(
      map((response:any) => response.cliente as Clientes),
      catchError(e => {
        if(e.status==400){//bad request
           return throwError(e);
        }
        console.error(e.error.mensaje)
        swal.fire(e.error.mensaje, e.error.error,'error');
        return throwError(e);
      })
    );

  }
  getClientes_byId(id):  Observable<Clientes>{
    return this.http.get<Clientes>(`${this.urlEnpoint}/${id}`).pipe(catchError(e => {
        console.error(e.error.mensaje);
        this.router.navigate(['/clientes']);
        swal.fire('Error al editar',e.error.mensaje,'error');
        return throwError(e);
    }));
  }
  update(cliente: Clientes): Observable<any>{
      return this.http.put<any>(`${this.urlEnpoint}/${cliente.id}`,cliente, {headers : this.HttpHeaders}).pipe(catchError(e => {
        if(e.status==400){//bad request
           return throwError(e);
        }
        console.error(e.error.mensaje)
        swal.fire(e.error.mensaje, e.error.error,'error');
        return throwError(e);
        })
    );
  }
  delete(id): Observable<Clientes>{
    return this.http.delete<Clientes>(`${this.urlEnpoint}/${id}`,{headers : this.HttpHeaders}).pipe(catchError(e => {
      console.error(e.error.mensaje)
      swal.fire(e.error.mensaje, e.error.error,'error');
      return throwError(e);

    })
  )}

  upload(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);
    const req = new HttpRequest('POST',`${this.urlEnpoint}/upload/`, formData,{
      reportProgress: true
    });
    return this.http.request(req);

 }
}
