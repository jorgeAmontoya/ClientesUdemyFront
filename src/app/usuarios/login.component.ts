import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from './usuario';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  titulo:string ='por favor sign In!';
  usuario:Usuario;
  constructor(private authService:AuthService, private router:Router) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire('login', `Hola ${this.authService.usuario.username} ya estas autenticado`, 'info');
      this.router.navigate(['/clientes']);
    }
  }
login():void{
console.log(this.usuario);

  if(this.usuario.username == "" || this.usuario.password == ""){
    Swal.fire('Error Login', 'Username or password vacios!', 'error');
    return;
  }
  this.authService.login(this.usuario).subscribe(response =>{
    console.log(response); 
    this.authService.guardarUsuario(response.access_token);
    this.authService.guardarToken(response.access_token);
    let usuario = this.authService.usuario;

    this.router.navigate(['/clientes']);
    Swal.fire('Login', `Hola ${usuario.username}, has iniciado sesión con éxito!`, 'success')
  }, err =>{
    if(err.status == 400){
      Swal.fire('Error Login', 'Usuario o clave incorrecta!', 'error')
    }
  } 
  );
}
}
