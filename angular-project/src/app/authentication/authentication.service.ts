import { inject, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin, UserLoginResponse } from './user-login';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private httpClient = inject(HttpClient);
  private jwtHelper = inject(JwtHelperService);

  constructor(@Inject('BASE_URL') private baseUrl: string, private router: Router) {  }

  loginUser(userData: UserLogin): Observable<UserLoginResponse> {
    return this.httpClient.post<UserLoginResponse>(this.baseUrl + '/user/login', userData);
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }

  storeUserCredentials(token: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  }

  public isAuthenticated() {
    const token = localStorage.getItem('token');

    return token && !this.jwtHelper.isTokenExpired(token);
  }
}
