import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

export * from './providers/app-rate-service';

@NgModule({
  imports: [CommonModule],
  declarations: [AppRateServiceModule],
  exports: [AppRateServiceModule]
})
export class AppRateServiceModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppRateServiceModule,
      providers: [AppRateServiceModule]
    };
  }
}
