import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class AppRateServiceProvider {
    appStarts = 0;
    threshold: number = 5;
    storeIds: any = {
        ios: '%APPSTORE_ID%',
        android: 'de.webfactor.jumpin'
    };
    appName = 'JumpIn';
    dialog: any = {
        title: `Bewerte ${this.appName}`,
        message:
            `Wenn Dir ${this.appName} gefällt, würdest Du es bitte bewerten? Das geht ganz schnell! :-) Danke für die Unterstützung!`,
        cancel: 'Nein, danke',
        rate: 'Jetzt bewerten'
    };

    constructor(
        public platform: Platform,
        private storage: Storage,
        private alertCtrl: AlertController,
        private inAppBrowser: InAppBrowser
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

    public showDialog(): void {
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

    private showAppStore(): void {
        let url: string;

        if (this.platform.is('ios'))
            url = `itms-apps://itunes.apple.com/de/app/pages/id${this.storeIds.ios}?mt=8`;
        else if (this.platform.is('android')) url = 'market://details?id=' + this.storeIds.android;
        else return;

        this.inAppBrowser.create(encodeURI(url), '_system');
    }
}
