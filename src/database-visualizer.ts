import {jsPlumbSurfaceComponent} from "jsplumbtoolkit-angular";
import {Surface, jsPlumbToolkit, Edge, Dialogs} from "jsplumbtoolkit";
import {Component, ViewChild} from "@angular/core";
import {TableNodeComponent} from "./table-node-component";
import {ViewNodeComponent} from "./view-node-component";
import {ColumnComponent} from "./column-component";
import {ControlsComponent} from './controls';


@Component({
  selector:"database-visualizer",
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
        <button (click)="setTarget()">Set Target</button>
        <ul>

        </ul>
      </div>
    
`
})
export class DatabaseVisualizerComponent {
  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent:jsPlumbSurfaceComponent;

  toolkit:jsPlumbToolkit;
  surface:Surface;

  toolkitId:string;
  surfaceId:string;

  nodeTypes = [
    { label: "Table", type: "table" },
    { label: "View", type: "view"}
  ];

  constructor() {
    this.toolkitId = "dbvis";
    this.surfaceId = "dbvisSurface";
  }

  view = {
    // Two node types - 'table' and 'view'
    nodes: {
      "table": {
        component: TableNodeComponent
      },
      "view": {
        component: ViewNodeComponent
      }
    },
    // Three edge types  - '1:1', '1:N' and 'N:M',
    // sharing  a common parent, in which the connector type, anchors
    // and appearance is defined.
    edges: {
      "common": {
        anchor: [ "Left", "Right" ], // anchors for the endpoints
        connector: "StateMachine",  //  StateMachine connector type
        cssClass:"common-edge",
        events: {
          "dbltap": (params) => {
            this._editEdge(params.edge);
          }
        },
        overlays: [
          [ "Label", {
            cssClass: "delete-relationship",
            label: "<i class='fa fa-times'></i>",
            events: {
              "tap":  (params:any) => {
                this.toolkit.removeEdge(params.edge);
              }
            }
          } ]
        ]
      },
      // each edge type has its own overlays.
      "1:1": {
        parent: "common",
        overlays: [
          ["Label", { label: "1", location: 0.1 }],
          ["Label", { label: "1", location: 0.9 }]
        ]
      },
      "1:N": {
        parent: "common",
        overlays: [
          ["Label", { label: "1", location: 0.1 }],
          ["Label", { label: "N", location: 0.9 }]
        ]
      },
      "N:M": {
        parent: "common",
        overlays: [
          ["Label", { label: "N", location: 0.1 }],
          ["Label", { label: "M", location: 0.9 }]
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
      "default": {
        component: ColumnComponent,
        paintStyle: { fill: "#f76258" },		// the endpoint's appearance
        hoverPaintStyle: { fill: "#434343" }, // appearance when mouse hovering on endpoint or connection
        edgeType: "common", // the type of edge for connections from this port type
        maxConnections: -1, // no limit on connections
        dropOptions: {  //drop options for the port. here we attach a css class.
          hoverClass: "drop-hover"
        }
      }
    }
  };

  renderParams = {
    layout: {
      type: "Spring",
      parameters: {
        padding: [150, 150]
      }
    },
    // Register for certain events from the renderer. Here we have subscribed to the 'nodeRendered' event,
    // which is fired each time a new node is rendered.  We attach listeners to the 'new column' button
    // in each table node.  'data' has 'node' and 'el' as properties: node is the underlying node data,
    // and el is the DOM element. We also attach listeners to all of the columns.
    // At this point we can use our underlying library to attach event listeners etc.
    events: {
      // This is called by the Toolkit when a new Port is added to a Node.
      edgeAdded: (params:any) => {
        // Check here that the edge was not added programmatically, ie. on load.
        if (params.addedByMouse) {
          this._editEdge(params.edge, true);
        }
      }
    },
    dragOptions: {
      filter: "i, .view .buttons, .table .buttons, .table-column *, .view-edit, .edit-name, .delete, .add"
    },
    consumeRightClick: false,
    zoomToFit:true
  };

  private _editEdge(edge:Edge, isNew?:boolean):void {
    Dialogs.show({
      id: "dlgRelationshipType",
      data: edge.data,
      onOK: (data:any) => {
        // update the type in the edge's data model...it will be re-rendered.
        // `type` is set in the radio buttons in the dialog template.
        this.toolkit.updateEdge(edge, data);
      },
      onCancel: () => {
        // if the user pressed cancel on a new edge, delete the edge.
        if (isNew) this.toolkit.removeEdge(edge);
      }
    });
  }

  dataGenerator(el:Element) {
    return {
      type:el.getAttribute("data-node-type")
    }
  }

  ngAfterViewInit() {
    this.surface = this.surfaceComponent.surface;
    this.toolkit = this.surface.getToolkit();
  }

  ngOnDestroy() {
    console.log("database visualizer being destroyed");
  }

  setTarget() {
    const p = this.toolkit.getNodes()[0].getPorts()[0]
    const e = this.toolkit.getAllEdges()[0]

    this.toolkit.setTarget(e, p)
  }


}