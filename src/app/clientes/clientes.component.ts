import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService} from './cliente.service';
import { CLIENTES } from './clientes.json';
import {tap} from 'rxjs/operators'; 
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit{

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute ) { }
  
  clientes?: Cliente[];
  paginador:any;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      let page: number = +params.get('page')!;
      if(!page){
        page = 0;
      }


    this.clienteService.getClientes(page).pipe(
      tap(response => {
        console.log('clientesComponent: tap 3');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    ).subscribe(response => {
      this.clientes = response.content as Cliente[];
      this.paginador = response;
    });
    });
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: '¿Estas seguro',
      text: `seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'si, eliminar'

    }).then((result) => {
      if (result.isConfirmed) {

this.clienteService.delete(cliente.id).subscribe(
  response=> {
this.clientes = this.clientes!.filter(cli => cli !== cliente)
    Swal.fire(
      'cliente eliminado!',
      `Cliente ${cliente.nombre} eliminado con exito`,
      'success'
    )
  }
)

       
      }
    
    
    })


  }
}
