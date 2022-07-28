import { Injectable } from '@angular/core';
import { WindowReferenceService } from './window-reference.service';

@Injectable({ providedIn: 'root'})

export class DataLayerService {
    window;
    constructor(private windowRef: WindowReferenceService){
        this.window = this.windowRef.nativeWindow;
    }

    pingHome(obj:any)
    {
        if(obj)  this.window.dataLayer.push(obj);
    }

      //list of all our dataLayer methods

   logPageView(url:any)
   {
       const hit = {
           event: 'content-view',
           pageName: url
       };
       this.pingHome(hit);
   }

   logEvent(event: any,category:any,action:any,label:any)
   {
       const hit = {
           event:event,
           category:category,
           action:action,
           label: label
       }
        this.pingHome(hit);
   }

//    logCustomDimensionTest(value)
//    {
//        const hit = {
//            event:'custom-dimension',
//            value:value
//        }
//        this.pingHome(hit);
//    }

}