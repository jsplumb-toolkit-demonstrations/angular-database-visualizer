import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { jsPlumbToolkitModule } from "@jsplumbtoolkit/browser-ui-angular";

import { DatabaseVisualizerComponent } from './database-visualizer';
import {TableNodeComponent} from "./table-node-component";
import {ViewNodeComponent} from "./view-node-component";
import {ColumnComponent} from "./column-component";
import {ControlsComponent} from './controls';
import {DeleteConnectionOverlayComponent} from "overlay-component"

@NgModule({
    imports: [BrowserModule, jsPlumbToolkitModule],
    declarations: [AppComponent,
      TableNodeComponent,
      ViewNodeComponent,
      ColumnComponent,
      DatabaseVisualizerComponent,
      ControlsComponent,
      DeleteConnectionOverlayComponent
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

