import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { FilterComponent } from './filter/filter.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CookieService } from 'ngx-cookie-service';
import { authInterceptor } from './auth.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ResizableModule } from 'angular-resizable-element';
import { GridstackModule } from 'gridstack/dist/angular';
import { ChartComponent } from './chart/chart.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// export function initializeAuth(authService: AuthService): () => Promise<boolean> {
//   return () => new Promise((resolve) => {
//     authService.initializeAuth().subscribe({
//       next: (isAuthenticated) => resolve(isAuthenticated),
//       error: () => resolve(false) // Default to false on error
//     });
//   });
// }

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    AppRoutingModule,
    MatDatepickerModule,
    MatDialogModule,
    FilterComponent,
    MatFormFieldModule,
    CookieService,
    provideNativeDateAdapter(),
    importProvidersFrom(ResizableModule),
    GridstackModule,
    ChartComponent,
    NgxSkeletonLoaderModule,
  ],
};
