import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RegistrationComponent } from './app/api-authorization/registration/registration.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/api-authorization/login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { errorHandlerInterceptor } from './app/api-authorization/error-handler.interceptor';
import { jwtInterceptor } from './app/api-authorization/jwt.interceptor';
import { OrderFormComponent } from './app/order-form/order-form.component';
import { OrdersPageComponent } from './app/orders-page/orders-page.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authGuard } from './app/api-authorization/auth.guard';
import { OrderDetailsComponent } from './app/order-details/order-details.component';
import { ProductsPageComponent } from './app/products-page/products-page.component';
import { loggedInGuard } from './app/api-authorization/logged-in.guard';

export function getBaseUrl() {
  return 'https://localhost:7186/api';
}

export function tokenGetter() {
  return localStorage.getItem("token");
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

bootstrapApplication(AppComponent, {
    providers: [
      providers,
      importProvidersFrom(BrowserModule, JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['https://localhost:7186', 'https://openlab.bsite.net'],
          disallowedRoutes: [],
        },
      })),
      provideAnimations(),
      provideHttpClient(withInterceptors([errorHandlerInterceptor, jwtInterceptor])),
      provideRouter([
        { path: '', component: LoginComponent},
        { path: 'login', component: LoginComponent, canActivate: [loggedInGuard]},
        { path: 'register', component: RegistrationComponent, canActivate: [loggedInGuard]},
        { path: 'order-form', component: OrderFormComponent, canActivate: [authGuard]},
        { path: 'order-form/:orderId', component: OrderFormComponent, canActivate: [authGuard] },
        { path: 'orders-page', component: OrdersPageComponent, canActivate: [authGuard]},
        { path: 'order-details/:orderId', component: OrderDetailsComponent, canActivate: [authGuard]},
        { path: 'products-page', component: ProductsPageComponent, canActivate: [authGuard]},
      ]), provideAnimationsAsync()
    ]
})
  .catch(err => console.error(err));
