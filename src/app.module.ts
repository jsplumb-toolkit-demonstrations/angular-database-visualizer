import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { jsPlumbToolkitModule } from "@jsplumbtoolkit/angular";

import { ROUTING } from './app.routing';

import { jsPlumbToolkitDragDropModule } from "@jsplumbtoolkit/angular-drop";

import { DatabaseVisualizerComponent } from './database-visualizer';
import {TableNodeComponent} from "./table-node-component";
import {ViewNodeComponent} from "./view-node-component";
import {ColumnComponent} from "./column-component";
import {ControlsComponent} from './controls';
import {DatasetComponent } from "./dataset";

@NgModule({
    imports:[ BrowserModule, jsPlumbToolkitModule, jsPlumbToolkitDragDropModule, ROUTING],
    declarations: [ AppComponent, TableNodeComponent, ViewNodeComponent, ColumnComponent, DatabaseVisualizerComponent, ControlsComponent, DatasetComponent ],
    bootstrap:    [ AppComponent ],
    entryComponents: [ TableNodeComponent, ColumnComponent, ViewNodeComponent ],
    schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
    constructor() {
        // initialize dialogs
        // Dialogs.initialize({
        //     selector: ".dlg"
        // });
    }
}

