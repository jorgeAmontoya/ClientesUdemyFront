import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  regiones?:Region[];
  public titulo:string = "Crear cliente";
  public errores: string[] = [];
  constructor(private clienteService: ClienteService, private router: Router, private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.carrgarCliente();
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }
carrgarCliente(): void {
  this.activatedRouter.params.subscribe(params => {
    let id = params['id']
    if(id) {
      this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
    }
  });

}


  public create(): void{
  console.log(this.cliente);
   this.clienteService.create(this.cliente).subscribe(
    cliente =>{ 

       
      this.router.navigate(['/clientes'])
    Swal.fire('nuevo Cliente', `el cliente ${cliente.nombre} ha sido creado con exito `, 'success')
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('codigo del error desde el backend: ' + err.status);

      console.error(err.error.errors);
    }
   )
  }

update(): void {
  console.log(this.cliente);
  this.cliente.facturas= null!;
  this.clienteService.update(this.cliente)
    .subscribe(json=>{
      this.router.navigate(['/clientes'])
      Swal.fire(' Cliente actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('codigo del error desde el backend: ' + err.status);

      console.error(err.error.errors);
    }
      )
}

compararRegion(o1:Region, o2:Region):boolean{
  if(o1 === undefined && o2 === undefined){
    return true
  }
  return o1 == null || o2 == null? false:o1.id === o2.id;
}

}
