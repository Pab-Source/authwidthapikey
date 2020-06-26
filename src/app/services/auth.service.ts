import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserModel } from "../models/user.model";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private apiKey = "AIzaSyAJ-yBGLUusfFqGzc2pP-9JXzalUr9KQo0";
  userToken: string = "";

  constructor(private http: HttpClient) {
    this.readStorage();
  }

  logout() {}

  login(user: UserModel) {
    return this.http
      .post(`${this.url}signInWithPassword?key=${this.apiKey}`, {
        ...user,
        returnSecureToken: true,
      })
      .pipe(
        map((resp) => {
          this.setToken(resp["idToken"]);
          return resp;
        })
      );
  }

  newUser(user: UserModel) {
    return this.http
      .post(`${this.url}signUp?key=${this.apiKey}`, {
        ...user,
        returnSecureToken: true,
      })
      .pipe(
        map((resp) => {
          this.setToken(resp["idToken"]);
          return resp;
        })
      );
  }

  private setToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("access_token", idToken);
  }

  readStorage() {
    const storageToken = localStorage.getItem("access_token");
    storageToken ? (this.userToken = storageToken) : (this.userToken = "");
    return this.userToken;
  }

  isAuthenticated(): boolean {
    return this.userToken.length > 2;
  }
}
