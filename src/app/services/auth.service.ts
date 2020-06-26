import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
	private apiKey = 'AIzaSyAJ-yBGLUusfFqGzc2pP-9JXzalUr9KQo0';
	userToken: string = '';

	constructor(private http: HttpClient) {
		this.readStorage();
	}

	logout() {
		localStorage.removeItem('access_token');
	}

	login(user: UserModel) {
		return this.http
			.post(`${this.url}signInWithPassword?key=${this.apiKey}`, {
				...user,
				returnSecureToken: true,
			})
			.pipe(
				map((resp) => {
					this.setToken(resp['idToken']);
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
					this.setToken(resp['idToken']);
					return resp;
				})
			);
	}

	private setToken(idToken: string) {
		this.userToken = idToken;
		localStorage.setItem('access_token', idToken);

		let today = new Date();
		today.setSeconds(3600);
		localStorage.setItem('expires', today.getTime().toString());
	}

	readStorage() {
		const storageToken = localStorage.getItem('access_token');
		storageToken ? (this.userToken = storageToken) : (this.userToken = '');
		return this.userToken;
	}

	isAuthenticated(): boolean {
		if (this.userToken.length < 2) {
			return false;
		}
		const expiresDate = new Date();
		expiresDate.setTime(Number(localStorage.getItem('expires')));

		if (expiresDate > new Date()) {
			return true;
		}
		return false;
	}
}
