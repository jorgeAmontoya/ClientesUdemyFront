import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map, startWith} from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo:string = 'nueva Factura';
  factura:Factura = new Factura();

  autoCompleteControl = new FormControl('');
  //productos: string[] = ['Mesa', 'Tablet', 'Sony', 'Samsung', 'Tv LG', 'Bicicleta'];
  productosFiltrados:  Observable<Producto[]> | any;

  constructor(private clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    private facturaService: FacturaService,
    private router: Router) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId')!;
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });
    this.productosFiltrados = this.autoCompleteControl.valueChanges
    .pipe(
      map((value:any) => typeof value === 'string'? value:value.nombre),
      flatMap(value => value ? this._filter(value): [])
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?:Producto):any | undefined{
    return producto? producto.nombre: undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent):void{
    let producto = event.option.value as Producto; 
    console.log(producto);
    if(this.existeItem(producto.id!)){
      this.incrementaCantidad(producto.id!)
    }else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    

    this.autoCompleteControl.setValue('');
    event.option.focus(); 
    event.option.deselect(); 

  }

  actualizarCantidad(id: number,event: any): void{
    let cantidad:number = event.target.value as number;
    if(cantidad == 0){
      return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item:ItemFactura) =>
      {
        if(id === item.producto.id){
          item.cantidad = cantidad
        }
        return item;
      });
  }

  existeItem(id:number):boolean{
    let existe= false;
    this.factura.items.forEach((item:ItemFactura) =>{
      if(id=== item.producto.id){
        existe = true;
      }
    });
    return existe;
  }
  incrementaCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item:ItemFactura) =>
    {
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    });
  }
  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item:ItemFactura) => id !==item.producto.id);
  }

  create(facturaForm: any):void{
    console.log(this.factura);
    if(this.factura.items.length == 0){
      this.autoCompleteControl.setErrors({'invalid': true});

    }
    if(facturaForm.form.valid && this.factura.items.length > 0){
      this.facturaService.create(this.factura).subscribe(factura=>{
        Swal.fire(this.titulo, `Factura ${factura.descripcion} creada con éxito!`, 'success');
        this.router.navigate(['/clientes']); 
      });
    }
  }

}
