import { Component, OnInit } from "@angular/core";
import { UserModel } from "../../models/user.model";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent {
  constructor(private auth: AuthService, private router: Router) {
    this.user = new UserModel();
  }

  user: UserModel;
  remember: boolean = false;

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      type: "info",
      text: "Espere por favor....",
    });
    Swal.showLoading();
    this.auth.newUser(this.user).subscribe(
      (resp) => {
        console.log(resp);
        Swal.close();
        if (this.remember) {
          localStorage.setItem("email", this.user.email);
        }
        this.router.navigateByUrl("/home");
      },
      (err) => {
        Swal.fire({
          type: "error",
          title: "Error al autenticar",
          text: err.error.error.message,
        });
      }
    );
  }
}
