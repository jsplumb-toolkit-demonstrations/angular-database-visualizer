import {Component, ElementRef, Input, ViewChild} from '@angular/core';

import {DatabaseVisualizerComponent } from "./database-visualizer";
import {DatasetComponent } from "./dataset";
import { Dialogs, jsPlumbToolkit, jsPlumbUtil } from "jsplumbtoolkit";
import { jsPlumbService } from "jsplumbtoolkit-angular";

@Component({
    selector: 'jsplumb-demo',
    template:`
        <nav>
            <a routerLink="/home" style="cursor:pointer;" routerLinkActive="active">Visualizer</a>
            <a routerLink="/data" style="cursor:pointer;" routerLinkActive="active">Dataset</a>
        </nav>
        <router-outlet></router-outlet>       
    `
})
export class AppComponent {

  @ViewChild(DatabaseVisualizerComponent) visualizer:DatabaseVisualizerComponent;
  @ViewChild(DatasetComponent) dataset:DatasetComponent;

  toolkitId:string;

  toolkit:jsPlumbToolkit;

  constructor(private $jsplumb:jsPlumbService, private elementRef:ElementRef) {
    this.toolkitId = this.elementRef.nativeElement.getAttribute("toolkitId");
  }

  ngOnInit() {
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams)
  }

  ngAfterViewInit() {
    this.toolkit.load({ url:"data/schema-1.json" });
  }

  toolkitParams = {
    nodeFactory:  (type:string, data:any, callback:(o:any)=>any) => {
      data.columns = [];
      Dialogs.show({
        id: "dlgName",
        title: "Enter " + type + " name:",
        onOK:  (d:any) => {
          data.name = d.name;
          // if the user entered a name...
          if (data.name) {
            if (data.name.length >= 2) {
              data.id = jsPlumbUtil.uuid();
              callback(data);
            }
            else
              alert(type + " names must be at least 2 characters!");
          }
          // else...do not proceed.
        }
      });
    },
    // the name of the property in each node's data that is the key for the data for the ports for that node.
    // we used to use portExtractor and portUpdater in this demo, prior to the existence of portDataProperty.
    // for more complex setups, those functions may still be needed.
    portDataProperty:"columns",
    //
    // Prevent connections from a column to itself or to another column on the same table.
    //
    beforeConnect:(source:any, target:any) => {
      return source !== target && source.getNode() !== target.getNode();
    }
  }

}
