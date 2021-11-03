import {Component, ElementRef, ViewChild} from '@angular/core'

import {DatabaseVisualizerComponent } from "./database-visualizer"

import {BrowserUIAngular, jsPlumbService} from "@jsplumbtoolkit/browser-ui-angular"
import {uuid,Vertex, isPort} from "@jsplumbtoolkit/core"

import {DatabaseVisualizerService} from "./database.visualizer.service"
import {CancelFunction, CommitFunction} from "@jsplumbtoolkit/dialogs"

@Component({
    selector: 'app-demo',
    template:`      
      <app-database-visualizer></app-database-visualizer>       
    `
})
export class AppComponent {

  @ViewChild(DatabaseVisualizerComponent) visualizer:DatabaseVisualizerComponent;

  toolkitId:string;

  toolkit:BrowserUIAngular;

  constructor(private $jsplumb:jsPlumbService, private elementRef:ElementRef, private databaseVisualizerService:DatabaseVisualizerService) {
    this.toolkitId = this.elementRef.nativeElement.getAttribute("toolkitId")
  }

  ngOnInit() {
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams)
  }

  ngAfterViewInit() {
    this.toolkit.load({ url:"assets/schema-1.json" })
  }

  toolkitParams:any = {
    nodeFactory:  (type:string, data:any, callback:(o:any)=>any) => {
      data.columns = [];
      this.databaseVisualizerService.showDialog({
        id: "dlgName",
        title: "Enter " + type + " name:",
        onOK:  (d:any) => {
          data.name = d.name;
          // if the user entered a name...
          if (data.name) {
            if (data.name.length >= 2) {
              data.id = uuid()
              callback(data)
            }
            else
              alert(type + " names must be at least 2 characters!")
          }
          // else...do not proceed.
        }
      });
    },
    edgeFactory:(type:string, data:any, continueCallback:CommitFunction, abortCallback:CancelFunction) => {
      this.databaseVisualizerService.showDialog({
        id:"dlgRelationshipType",
        title:"Relationship",
        onOK:continueCallback,
        onCancel:abortCallback
      })
      return true
    },
    // the name of the property in each node's data that is the key for the data for the ports for that node.
    // we used to use portExtractor and portUpdater in this demo, prior to the existence of portDataProperty.
    // for more complex setups, those functions may still be needed.
    portDataProperty:"columns",
    //
    // Prevent connections from a column to itself or to another column on the same table.
    //
    beforeConnect:(source:Vertex, target:Vertex) => {
      return source !== target && isPort(source) && isPort(target) && source.getParent() !== target.getParent()
    }
  }

}
