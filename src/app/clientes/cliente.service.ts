import { Injectable } from '@angular/core';
import{formatDate} from '@angular/common';
import { Cliente } from './cliente';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable,of, throwError} from 'rxjs';
import { CLIENTES } from './clientes.json';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { response } from 'express';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';







@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  //private httpHeaders = new HttpHeaders({'content-type': 'application/json'});

constructor(private http: HttpClient, private router: Router 
 /*, private authService:AuthService*/){}

/* Se reemplazo con el tokenInterceptor
private agregarAuthorizationHeader(){
  let token = this.authService.token;
  if(token != null){
    return this.httpHeaders.append('Authorization','Bearer ' + token);
  }
  return this.httpHeaders;
}*/

/* se reemlazo por el AuthInterceptor
private isNoAutorizado(e: any):boolean{
  if(e.status ==401){
    if(this.authService.isAuthenticated()){
      this.authService.logout();
    }
    this.router.navigate(['/login']);
    return true;
  }
  if(e.status ==403){
    Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username}, no tienes acceso a este recurso`, 'warning');
    this.router.navigate(['/clientes']);
    return true;
  }
  return false;

}*/

getRegiones(): Observable<Region[]>{
  return this.http.get<Region[]>(this.urlEndPoint + '/regiones'/*, {headers: this. agregarAuthorizationHeader()}).pipe(
    catchError(e=>{
      //this.isNoAutorizado(e);
      return throwError(e);
    })*/
  );
}


  getClientes(page: number):Observable<any> {
    //return of(CLIENTES);
   // return this.http.get<Cliente[]>(this.urlEndPoint)
   return this.http.get(this.urlEndPoint + '/page/' + page).pipe(

     tap((response:any) => {
      
      console.log('ClienteService: tap 1');
      (response.content as Cliente[]).forEach(cliente =>{
        console.log(cliente.nombre)

      })

     }),
     map((response: any) => {
        (response.content as Cliente[]).map(cliente =>{
         cliente.nombre = cliente.nombre.toUpperCase();
         //cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'es-US');
         return cliente;

       });
       return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre)
  
        })
  
       }),
   );
   
  }

  create(cliente:Cliente):Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente/*,{headers: this. agregarAuthorizationHeader()}*/ ).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(e => {
        /*if(this.isNoAutorizado(e)){
            return throwError(e);
        }*/

        if(e.status==400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }

        //Swal.fire(e.error.mensaje, e.error.error, 'error'); 
        return throwError(e);

      })
    );

  }
  getCliente(id:any):Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`/*,{headers: this. agregarAuthorizationHeader()}*/).pipe(

      catchError(e => {
       /* if(this.isNoAutorizado(e)){
          return throwError(e);
      }*/
      if(e.status!=401 && e.error.mensaje){
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);

      }
        //Swal.fire('error al editar', e.error.mensaje, 'error');
        return throwError(e);

      })
    );
  
  }

  update(cliente: Cliente):Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente/*, {headers: this. agregarAuthorizationHeader()}*/).pipe(
    
      catchError(e => {
       /* if(this.isNoAutorizado(e)){
          return throwError(e);
      }*/
        if(e.status==400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
       // Swal.fire(e.error.mensaje, e.error.error, 'error'); 
        return throwError(e);

      })
    );
  }

    delete(id: any):Observable<Cliente> {
      return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`/*,{headers: this. agregarAuthorizationHeader()}*/).pipe(
        catchError(e => {
         /* if(this.isNoAutorizado(e)){
            return throwError(e);
        }*/
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
         // Swal.fire(e.error.mensaje, e.error.error, 'error'); 
          return throwError(e);
  
        })
      );
    
    }

    subirFoto(archivo: File, id:any ): Observable<HttpEvent<any>>{
      let formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("id", id);

      /*let httpHeaders = new HttpHeaders();
      let token = this.authService.token;
      if(token != null){
        httpHeaders = httpHeaders.append("Authorization", 'Bearer ' + token);
      }*/

      const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`,formData,{
        reportProgress:true,
        //headers: httpHeaders
      })

      return this.http.request(req)/*.pipe(
        catchError(e=>{
          this.isNoAutorizado(e);
          return throwError(e);
        })
      )*/;

    }

  }





