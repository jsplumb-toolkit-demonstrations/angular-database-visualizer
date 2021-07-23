import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { jsPlumbToolkitModule } from "@jsplumbtoolkit/browser-ui-angular";

import { jsPlumbToolkitDragDropModule } from "@jsplumbtoolkit/browser-ui-angular-drop";

import { DatabaseVisualizerComponent } from './database-visualizer';
import {TableNodeComponent} from "./table-node-component";
import {ViewNodeComponent} from "./view-node-component";
import {ColumnComponent} from "./column-component";
import {ControlsComponent} from './controls';

@NgModule({
    imports:[ BrowserModule, jsPlumbToolkitModule, jsPlumbToolkitDragDropModule],
    declarations: [ AppComponent, TableNodeComponent, ViewNodeComponent, ColumnComponent, DatabaseVisualizerComponent, ControlsComponent ],
    bootstrap:    [ AppComponent ],
    entryComponents: [ TableNodeComponent, ColumnComponent, ViewNodeComponent ],
    schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

