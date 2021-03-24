import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import { environment } from './environments/environment';

import { ready } from "@jsplumbtoolkit/browser-ui";

if (environment.production) {
  enableProdMode();
}

ready(() => {
    platformBrowserDynamic().bootstrapModule(AppModule);
});

