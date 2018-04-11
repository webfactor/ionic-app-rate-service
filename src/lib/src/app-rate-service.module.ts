import { AppRateService } from './providers/app-rate-service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, TranslateModule.forRoot()]
})
export class AppRateServiceModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppRateServiceModule,
            providers: [AppRateService, InAppBrowser]
        };
    }
}
