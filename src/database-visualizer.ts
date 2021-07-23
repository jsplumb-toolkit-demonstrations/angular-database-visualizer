import {jsPlumbSurfaceComponent, BrowserUIAngular} from "@jsplumbtoolkit/browser-ui-angular"
import { Surface, EVENT_DBL_TAP, EVENT_TAP } from "@jsplumbtoolkit/browser-ui"
import { Edge, EVENT_EDGE_ADDED } from "@jsplumbtoolkit/core"
import {Component, ViewChild} from "@angular/core"
import {TableNodeComponent} from "./table-node-component"
import {ViewNodeComponent} from "./view-node-component"
import {ColumnComponent} from "./column-component"
import {DatabaseVisualizerService} from "./database.visualizer.service"
import { SpringLayout } from "@jsplumbtoolkit/layout-spring"

import { LabelOverlay} from "@jsplumb/core"
import { AnchorLocations, DEFAULT } from "@jsplumb/common"

import { StateMachineConnector } from "@jsplumb/connector-bezier"

const COMMON = "common"
const ONE_TO_N = "1:N"
const N_TO_M = "N:M"
const ONE_TO_ONE = "1:1"
const TABLE = "table"
const VIEW = "view"

const ONE = "1"
const N = "N"
const M = "M"

@Component({
  selector:"app-database-visualizer",
  template:`
    <div class="jtk-demo-canvas">
      <jsplumb-surface [surfaceId]="surfaceId" [toolkitId]="toolkitId" [view]="view" [renderParams]="renderParams"></jsplumb-surface>
      <jsplumb-miniview [surfaceId]="surfaceId"></jsplumb-miniview>
      <jsplumb-controls [surfaceId]="surfaceId"></jsplumb-controls>
    </div>

      <div class="jtk-demo-rhs">
        <div class="sidebar node-palette" jsplumb-surface-drop selector="div" [surfaceId]="surfaceId" [dataGenerator]="dataGenerator">
          <div class="sidebar-item" *ngFor="let nodeType of nodeTypes" [attr.data-node-type]="nodeType.type" title="Drag to add new">{{nodeType.label}}</div>
        </div>
        <p>
          This sample application is a copy of the Database Visualizer application, using the Toolkit's
          Angular integration components and Angular CLI.
        </p>
        <ul>

        </ul>
      </div>
    
`
})
export class DatabaseVisualizerComponent {
  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent:jsPlumbSurfaceComponent;

  toolkit:BrowserUIAngular;
  surface:Surface;

  toolkitId:string;
  surfaceId:string;

  nodeTypes = [
    { label: "Table", type: TABLE },
    { label: "View", type: VIEW}
  ];

  constructor(private service:DatabaseVisualizerService) {
    this.toolkitId = "dbvis";
    this.surfaceId = "dbvisSurface";
  }

  view = {
    // Two node types - 'table' and 'view'
    nodes: {
      [TABLE]: {
        component: TableNodeComponent
      },
      [VIEW]: {
        component: ViewNodeComponent
      }
    },
    // Three edge types  - '1:1', '1:N' and 'N:M',
    // sharing  a common parent, in which the connector type, anchors
    // and appearance is defined.
    edges: {
      [COMMON]: {
        anchor: [ AnchorLocations.Left, AnchorLocations.Right ], // anchors for the endpoints
        connector: StateMachineConnector.type,  //  StateMachine connector type
        cssClass:"common-edge",
        events: {
          [EVENT_DBL_TAP]: (params) => {
            this._editEdge(params.edge)
          }
        },
        overlays: [
          {
            type: LabelOverlay.type,
            options: {
              cssClass: "delete-relationship",
              label: "x",
              events: {
                [EVENT_TAP]: (params: any) => {
                  this.toolkit.removeEdge(params.edge)
                }
              }
            }
          }
        ]
      },
      // each edge type has its own overlays.
      [ONE_TO_ONE]: {
        parent: COMMON,
        overlays: [
          { type:LabelOverlay.type, options:{ label: ONE, location: 0.1 }},
          { type:LabelOverlay.type, options:{ label: ONE, location: 0.9 }}
        ]
      },
      [ONE_TO_N]: {
        parent: COMMON,
        overlays: [
          { type:LabelOverlay.type, options:{ label: ONE, location: 0.1 }},
          { type:LabelOverlay.type, options:{ label: N, location: 0.9 }}
        ]
      },
      [N_TO_M]: {
        parent: COMMON,
        overlays: [
          { type:LabelOverlay.type, options:{ label: N, location: 0.1 }},
          { type:LabelOverlay.type, options:{ label: M, location: 0.9 }}
        ]
      }
    },
    // There is only one type of Port - a column - so we use the key 'default' for the port type
    // Here we define the appearance of this port,
    // and we instruct the Toolkit what sort of Edge to create when the user drags a new connection
    // from an instance of this port. Note that we here we tell the Toolkit to create an Edge of type
    // 'common' because we don't know the cardinality of a relationship when the user is dragging. Once
    // a new relationship has been established we can ask the user for the cardinality and update the
    // model accordingly.
    ports: {
      [DEFAULT]: {
        component: ColumnComponent,
        paintStyle: { fill: "#f76258" },		// the endpoint's appearance
        hoverPaintStyle: { fill: "#434343" }, // appearance when mouse hovering on endpoint or connection
        edgeType: COMMON, // the type of edge for connections from this port type
        maxConnections: -1 // no limit on connections
      }
    }
  };

  renderParams = {
    layout: {
      type: SpringLayout.type,
      padding: [150, 150]
    },
    events: {
      // This is called by the Toolkit when a new edge is added
      [EVENT_EDGE_ADDED]: (params:any) => {
        // Check here that the edge was not added programmatically, ie. on load.
        if (params.addedByMouse) {
          this._editEdge(params.edge, true);
        }
      }
    },
    dragOptions: {
     // filter: "i, .view .buttons, .table .buttons, .table-column *, .view-edit, .edit-name, .delete, .add"
    },
    consumeRightClick: false,
    zoomToFit:true
  }

  private _editEdge(edge:Edge, isNew?:boolean):void {
    this.service.showDialog({
      id: "dlgRelationshipType",
      data: edge.data,
      onOK: (data:Record<string, any>) => {
        // update the type in the edge's data model...it will be re-rendered.
        // `type` is set in the radio buttons in the dialog template.
        this.toolkit.updateEdge(edge, data)
      },
      onCancel: () => {
        // if the user pressed cancel on a new edge, delete the edge.
        if (isNew) {
          this.toolkit.removeEdge(edge)
        }
      }
    });
  }

  dataGenerator(el:Element) {
    return {
      type:el.getAttribute("data-node-type")
    }
  }

  ngAfterViewInit() {
    this.surface = this.surfaceComponent.surface
    this.toolkit = this.surfaceComponent.toolkit
  }



}
