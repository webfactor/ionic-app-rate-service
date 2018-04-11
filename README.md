# AppRateService


Show a popup to ask for rating the app.

## Installation

- Install via npm  
`npm i @webfactor/ionic-app-rate-service`

- Add `AppRateServiceModule.forRoot()` and `IonicStorageModule.forRoot(),`  to your ionic module imports.

If you don´t wannt to use default-text you must import the TranslateModule.forRoot too.

In your json you create a entry like

```typescript
 "appRateService": {
      "title": "Rate %APPNAME%",
      "message": "If you like it, please rate :)",
      "cancel": "no, thanks"
      "rate":"Rate now"
```      

## Methods

```typescript
init(): void 
```
Start the counter. If no other threshold set the ratemessage show if the app opened 5 times.

```typescript
async showDialog(): Promise<void>
```
Show the message without waiting for threshold.

```typescript
setStoreIds(iosId: string; androidId: string ): void
```
Set storeids for both platforms. They must set or an error occure.

```typescript
setThreshold(count: number): void
```
Set threshold after how many appopens the message should show. Default is 5.


## Example
```typescript
   constructor(public appRate: AppRateService) {
   
    this.appRate.setStoreIds("00000000000","androidId")
    this.appRate.setThreshold(10);
    this.appRate.init();

  }
``` 
## Preview
![Preview](/images/preview.png)
