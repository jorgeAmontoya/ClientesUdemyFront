import { Injectable } from '@angular/core';
import{formatDate} from '@angular/common';
import { Cliente } from './cliente';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable,of, throwError} from 'rxjs';
import { CLIENTES } from './clientes.json';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { response } from 'express';







@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'content-type': 'application/json'});

constructor(private http: HttpClient, private router: Router){}
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
    return this.http.post(this.urlEndPoint, cliente,{headers: this.httpHeaders} ).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error'); 
        return throwError(e);

      })
    );

  }
  getCliente(id:any):Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(

      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('error al editar', e.error.mensaje, 'error');
        return throwError(e);

      })
    );
  
  }

  update(cliente: Cliente):Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
    
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error'); 
        return throwError(e);

      })
    );
  }

    delete(id: any):Observable<Cliente> {
      return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.httpHeaders}).pipe(
        catchError(e => {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error'); 
          return throwError(e);
  
        })
      );
    
    }

  }





