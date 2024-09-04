// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebPushNotificationsService {
//   private _swRegistration;
//   private _isSubscribed: boolean;
//   private applicationServerPublicKey: string;

//   constructor(private httpClient: HttpClient) {
//     this.applicationServerPublicKey = 'nuestra clave privada';
//   }

//   private checkServiceWorkerPushEnabled(): boolean {
//     return ('serviceWorker' in navigator && 'PushManager' in window);
//   }


//   private enableServiceWorker(): void {
//     navigator.serviceWorker.register('/app/serviceWorker/sw.js',     
//         { scope: '/app/serviceWorker/'})
//     .then( swReg => {
//         console.info('Service Worker esta registrado', swReg);   
//         this.swRegistration = swReg; this.initialiseUI();
//     })
//    .catch( function(error) {
//         console.error('Service Worker Error', error);
//    });
// }
// }
