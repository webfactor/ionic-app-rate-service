import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AppRateService {
    translations: any = {};
    rate: string = 'Jetzt bewerten';
    cancel: string = 'Nein, danke';
    title: string = 'Bewerte uns';
    message: string = 'Wenn Dir unsere App gefällt, würdest Du Sie bitte bewerten? Das geht ganz schnell! :-) Danke für die Unterstützung!';

    appStarts = 0;
    threshold: number = 5;
    storeIds: any = {
        ios: '',
        android: ''
    };
    dialog: any;

    constructor(
        public platform: Platform,
        private storage: Storage,
        private alertCtrl: AlertController,
        private inAppBrowser: InAppBrowser,
        protected translate: TranslateService
    ) {}

    public init() {
        this.getAppStarts().then(appStarts => {
            this.appStarts = appStarts;

            this.platform.ready().then(() => this.handleAppStart());
            this.platform.resume.subscribe(() => this.handleAppStart());
        });
    }

    private getAppStarts(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.storage
                .get('appStarts')
                .then(value => (value ? resolve(value) : resolve(0)))
                .catch(() => resolve(0));
        });
    }

    private handleAppStart(): void {
        this.appStarts++;
        this.storage.set('appStarts', this.appStarts).then(() => this.showDialogWithThreshold());
    }

    private getTranslations(): Promise<any> {
        return this.translate.get('appRateService').toPromise();
    }

    public async showDialog(): Promise<void> {
        this.translations = await this.getTranslations();
        this.dialog = {
            title: this.translations.title || this.title,
            message: this.translations.message || this.message,
            cancel: this.translations.cancel || this.cancel,
            rate: this.translations.rate || this.rate
        };

        let alert = this.alertCtrl.create({
            title: this.dialog.title,
            message: this.dialog.message,
            buttons: [
                {
                    text: this.dialog.cancel,
                    role: 'cancel'
                },
                {
                    text: this.dialog.rate,
                    handler: () => {
                        this.showAppStore();
                    }
                }
            ]
        });

        alert.present();
    }

    private showDialogWithThreshold(): void {
        if (this.appStarts == this.threshold) this.showDialog();
    }

    public setStoreIds(ios: string, android: string): void {
        this.storeIds = { ios, android };
    }

    public setThreshold(count: number): void {
        this.threshold = count;
    }

    private showAppStore(): void {
        let url: string;

        if (this.platform.is('ios'))
            url = `itms-apps://itunes.apple.com/de/app/pages/id${this.storeIds.ios}?mt=8`;
        else if (this.platform.is('android')) url = 'market://details?id=' + this.storeIds.android;
        else return;

        this.inAppBrowser.create(encodeURI(url), '_system');
    }
}
