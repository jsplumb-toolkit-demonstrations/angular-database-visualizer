
<a name="top"></a>
## Database Visualizer (Angular)

This is a port of the Database Visualizer application that demonstrates the Toolkit's Angular integration. All versions of Angular from
2.x.x to 10.x.x are supported; this demonstration uses version 9. 

![Database Visualizer Demonstration](demo-dbase.png)

This page gives you an in-depth look at how the application is put together.

- [package.json](#package)
- [Page Setup](#setup)
- [Typescript Setup](#typescript-setup)
- [Bootstrap](#bootstrap)
- [Polyfills](#polyfills)
- [Demo Component](#demo-component)
  - [Template](#demoComponentTemplate)
  - [Implementation](#demoComponentCode)
  - [Routing](#routing)
- [Database Visualizer Component](#database-visualizer-component)
    - [Declaration](#flowchart-component-declaration)
    - [Rendering Parameters](#renderParams)
    - [View](#view)
    - [Initialisation](#initialisation)
    - [Rendering Tables and Views](#rendering-tables-and-views)
    - [Rendering Table Columns](#rendering-columns)
    - [Dragging New Nodes](#dragging)
    - [Behaviour](#behaviour)    
    - [Selecting Nodes](#selecting)
- [Dataset Component](#dataset-component)  
- [Controls Component](#controls-component)  
- [Dialogs](#dialogs)


<a name="package"></a>
### package.json

```json
{
  "name": "jsplumb-toolkit-angular",
  "version": "1.6.17",
  "license": "Commercial",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "prod-build": "ng build --prod --base-href .",
    "tscr": "tsc -traceResolution",
    "tsc": "tsc"
  },
  "private": true,
  "dependencies": {
    "@angular/common": "^9.1.1",
    "@angular/compiler": "^9.1.1",
    "@angular/core": "^9.1.1",
    "@angular/forms": "^9.1.1",
    "@angular/platform-browser": "^9.1.1",
    "@angular/platform-browser-dynamic": "^9.1.1",
    "@angular/router": "^9.1.1",
    "jsplumbtoolkit": "file:../../jsplumbtoolkit.tgz",
    "jsplumbtoolkit-angular": "file:../../jsplumbtoolkit-angular.tgz",
    "jsplumbtoolkit-angular-drop": "file:../../jsplumbtoolkit-angular-drop.tgz",
    "jsplumbtoolkit-demo-support": "file:../../jsplumbtoolkit-demo-support.tgz",
    "jsplumbtoolkit-drop": "file:../../jsplumbtoolkit-drop.tgz",
    "jsplumbtoolkit-syntax-highlighter": "file:../../jsplumbtoolkit-syntax-highlighter.tgz",
    "jsplumbtoolkit-undo-redo": "file:../../jsplumbtoolkit-undo-redo.tgz",
    "core-js": "^2.4.1",
    "rxjs": "^6.5.3",
    "rxjs-compat": "^6.0.0-rc.0",
    "tslib": "^1.10.0",
    "zone.js": "~0.10.2"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~0.901.1",
    "@angular-devkit/schematics": "^9.1.1",
    "@angular/cli": "9.1.1",
    "@angular/compiler-cli": "^9.1.1",
    "@types/jasmine": "2.5.38",
    "@types/node": "^12.11.1",
    "codelyzer": "^5.1.2",
    "ts-node": "~2.0.0",
    "tslint": "~4.4.2",
    "typescript": "~3.8.3"
  }
}

```

There are seven entries specific to jsPlumb:

```json
{
  "jsplumbtoolkit": "file:../../jsplumbtoolkit.tgz",                            // main toolkit code
  "jsplumbtoolkit-angular": "file:../../jsplumbtoolkit-angular.tgz",            // angular integration
  "jsplumbtoolkit-angular-drop": "file:../../jsplumbtoolkit-angular-drop.tgz",  // angular drag/drop components
  "jsplumbtoolkit-demo-support": "file:../../jsplumbtoolkit-demo-support.tgz",  // support code for toolkit demos
  "jsplumbtoolkit-drop": "file:../../jsplumbtoolkit-drop.tgz",                  // drag/drop manager
  "jsplumbtoolkit-syntax-highlighter": "file:../../jsplumbtoolkit-syntax-highlighter.tgz", // used to show the current dataset
  "jsplumbtoolkit-undo-redo": "file:../../jsplumbtoolkit-undo-redo.tgz",        // undo/redo manager
}
```


[TOP](#top)

---

<a name="setup"></a>
### Page Setup

##### CSS

Angular CLI expects a CSS file to be placed at `src/styles.css`. Our `styles.css` contains
styles for the demo and also imports 4 other css files:

- `jsplumbtoolkit-syntax-highlighter.css`     For the Dataset component

- `jsplumbtoolkit.css`   Provides sane defaults for the Toolkit. You should start building your app with this in the cascade; you can
remove it eventually, of course, but you just need to ensure you have provided values elsewhere in your CSS. Generally the safest thing to do is to just include it at the top of your cascade.

- `jsplumbtoolkit-demo-support.css`   Some basic common styles for all the demo pages.

- `database-visualizer.css` The styles from the non-Angular Database Visualizer demonstration


[TOP](#top)

---

<a name="typescript-setup"></a>
### Typescript Setup

This is the `tsconfig.json` file used by this demonstration:

```javascript
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "lib": [ "es2015", "dom" ]
  }
}
```

[TOP](#top)

---

<a name="bootstrap"></a>
### Bootstrap

The application is bootstrapped inside `src/main.ts`:

```javascript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { AppModule }              from './app.module';
import { jsPlumbToolkit } from "jsplumbtoolkit";

if (environment.production) {
    enableProdMode();
}

jsPlumbToolkit.ready(() => {
    platformBrowserDynamic().bootstrapModule(AppModule);
});


```

Here, `app` is a module defined in `src/app.module.ts`:

```javascript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { jsPlumbToolkitModule } from "jsplumbtoolkit-angular";
import { Dialogs } from "jsplumbtoolkit";
import { ROUTING } from './app.routing';
import { DatasetComponent } from "./dataset";

import { DatabaseVisualizerComponent } from './database-visualizer';
import {TableNodeComponent} from "./table-node-component";
import {ViewNodeComponent} from "./view-node-component";
import {ColumnComponent} from "./column-component";


@NgModule({
    imports:[ BrowserModule, jsPlumbToolkitModule, ROUTING],
    declarations: [ AppComponent, TableNodeComponent, ViewNodeComponent, ColumnComponent, DatasetComponent, DatabaseVisualizerComponent ],
    bootstrap:    [ AppComponent ],
    entryComponents: [ TableNodeComponent, ColumnComponent, ViewNodeComponent ],
    schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
    constructor() {
        // initialize dialogs
        Dialogs.initialize({
            selector: ".dlg"
        });
    }
}


```

[TOP](#top)

---

<a name="polyfills"></a>
### Polyfills

Angular requires polyfills in order to work with IE 9, 10 and 11.  In this demo we enable the following polyfills in
the `polyfills.ts` file:

```javascript
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
```

For more information about polyfills, see [the Angular documentation](https://angular.io/guide/browser-support).

[TOP](#top)

---


<a name="demo-component"></a>
### Demo Component

The demo is written as a root level demo component, which has two child components - the first is the 'database-visualizer' component, which draws the visualizer, using several jsPlumb Toolkit components. The second is the 'dataset' component, which dumps out the current contents of the dataset in syntax highlighted json. We use Angular routing to switch between the two components. 

In the HTML file, the demo component is declared with a single element:

```html
<jsplumb-demo>Loading Database Visualizer...</jsplumb-demo>
```

<a name="demoComponentTemplate"></a>
#### Template 

The `jsplumb-demo` component is created inside the file `src/app.component.ts`. Its template looks like this:

```html
<nav>
    <a routerLink="/home" style="cursor:pointer;">Visualizer</a>
    <a routerLink="/data" style="cursor:pointer;">Dataset</a>
</nav>
<router-outlet></router-outlet>
```

The demo component provides a navigation bar with two targets, and a router outlet for the current view.

<a name="demoComponentCode"></a>
#### Implementation

This is the code for the demo component:

```javascript
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
              // generate an id
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
    portDataProperty:"columns",
    beforeConnect:(source:any, target:any) => {
      return source !== target && source.getNode() !== target.getNode();
    }
  }

}
```

It has three responsibilities:

##### 1. Creating an instance of the jsPlumb Toolkit.

We do this in two parts. Firstly, we inject the element into the component's constructor, and read out the ID we should use for the Toolkit instance from an attribute on this element (remember this is the root component; it cannot be injected into via `Input` statements). Secondly, in `ngOnInit`, we create an instance of the Toolkit, via the jsPlumb Service, using the class member `toolkitParams` This Toolkit instance persists for the life of the page load; when child components are instantiated they then render the underlying contents. When the user switches routes, the current component is destroyed, but the associated Toolkit instance is not.

- **nodeFactory** is a function that jsPlumb calls when a new node is dropped onto the canvas. The node factory is given the type of the node and any initial data (that was created via the `dataGenerator` plugged in to the drag/drop mechanism), and a callback function that should be called with the given data if the factory wishes to proceed. In our implementation we popup a dialog prompting the user for a node name, and if that name is two or more characters in length, we convert it to lower case and hit the callback. If the name is less than two characters in length we do not proceed.

- **portDataProperty** is the name of the property in each node's data that is the key for the data for the ports for that node. In this demonstration that property name is `columns`, ie. the underlying data object for some table node looks like this:
 
 ```javascript
{
    "id": "book",
    "name": "Book",
    "type": "table",
    "columns": [
        {
            "id": "id",
            "datatype": "integer",
            "primaryKey": true
        },
        {
            "id": "isbn",
            "datatype": "varchar"
        },
        {
            "id": "title",
            "datatype": "varchar"
        }
    ]
}
```

- **beforeConnect** is a function that is called prior to any edge being added, which in this case returns false if the source and target columns of some propspective relationship belong to the same table. This results in the edge being aborted.

##### 2. Acting as the parent for the dataset and database-visualizer components

We declare a `DatabaseVisualizerComponent` and a `DatasetComponent` as view children of the main component. These are created by Angular whenever the related route becomes active.

##### 3. Loading the initial data (in the `ngAfterViewInit` method)

We do this in `ngAfterViewInit`. We know that this method will only be called one time in the life of this demonstration so it's safe to do it here.

[TOP](#top)

---

<a name="routing"></a>
#### Routing
 
Routes are declared in `src/app.routing.ts`:
 
```javascript
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { DatasetComponent } from "./dataset";
import { DatabaseVisualizerComponent } from "./database-visualizer";

export const AppRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DatabaseVisualizerComponent },
  { path: 'data', component: DatasetComponent }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(AppRoutes, {useHash: true});

```

In this demonstration we use the hash based router, but you can use path based routing, it doesn't matter to jsPlumb. 

This routing module is then imported (along with the required Angular routing imports) in `app.module.ts`:

```javascript
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
...
import { ROUTING } from './app.routing';

...

@NgModule({
    imports:[ BrowserModule, jsPlumbToolkitModule, ROUTING],
    ...
    
})
```

[TOP](#top)

---

<a name="database-visualizer-component"></a>
### Database Visualizer Component

This component draws the database visualizer, using several Toolkit components. It can be found in the file `database-visualizer.ts`.

<a name="database-visualizer-component-declaration"></a>
#### Declaration

```javascript
@Component({
  selector:"database-visualizer",
  template:`
    <div class="sidebar node-palette" jsplumb-palette selector="div" [surfaceId]="surfaceId" [typeExtractor]="typeExtractor" [dataGenerator]="dataGenerator">
      <div *ngFor="let nodeType of nodeTypes" [attr.data-node-type]="nodeType.type" title="Drag to add new">{{nodeType.label}}</div>
    </div>
    <jsplumb-surface [surfaceId]="surfaceId" [toolkitId]="toolkitId" [view]="view" [renderParams]="renderParams"></jsplumb-surface>
    <jsplumb-miniview [surfaceId]="surfaceId"></jsplumb-miniview>
    <jsplumb-controls [surfaceId]="surfaceId"></jsplumb-controls>
`
})
```

The template uses all 3 components offered by the Toolkit's Angular integration: a Surface, a Miniview, and a Palette from which new items can be dragged onto the canvas. Additionally, we use a `jsplumb-controls` component, which is [a simple component supplied by the jsPlumbToolkitModule](https://docs.jsplumbtoolkit.com/toolkit/current/articles/angular-integration#controls) that offers lasso/pan/zoom/undo/redo.

**Points to note:**

- The first div in the template is a Toolkit `palette` component. In Angular, components are identified by a `selector`, which needs only
to be a valid CSS3 selector. The `palette` component's selector is `[jsplumb-palette]`, so the first div is considered to be a Palette
component.

- The palette is given the ID of the Surface to attach itself to (see below)

- The palette is passed in a `typeExtractor` (using "square bracket" syntax, which means in this case that the flowchart component
declares a method called `typeExtractor`) whose job is to return the type of some dropped item, given the related DOM element.

- We pass in `renderParams` (parameters for the Surface constructor) to the `jsplumb-surface` component. We also provide a `nodeResolver`, 
whose job it is to map node types to components.

- We assign a `surfaceId` and a `jtkId` to the Surface component. `jtkId` is set to `"toolkitId"`, which is declared on the component. We use this 
Toolkit ID in various places in this demo. The given`surfaceId` is used by the Palette, Miniview and Controls components to identify which Surface to attach to.

- We provide the ID of the Surface to attach the `jsplumb-miniview` to.

- We provide the ID of the Surface to attach the `jsplumb-controls` to.

[TOP](#top)

---

<a name="renderParams"></a>
#### Rendering Parameters

The parameters passed in to the Surface's constructor are:
 
 
```javascript
renderParams = {
    layout: {
      type: "Spring",
      parameters: {
        padding: [150, 150]
      }
    },    
    events: {
      edgeAdded: (params:any) => {        
        if (params.addedByMouse) {
          this._editEdge(params.edge, true);
        }
      }
    },
    dragOptions: {
      filter: "i, .view .buttons, .table .buttons, .table-column *, .view-edit, .edit-name"
    }
    zoomToFit:true
}
```

- **layout** We use a [Spring (Force Directed)](https://docs.jsplumbtoolkit.com/toolkit/current/articles/layout-spring) layout in this demonstration.
- **events** We bind to the `edgeAdded` event, to [edit the label of new edges](#edit-new-edge).
- **dragOptions** There are a bunch of parts of the UI that we do not want to drag nodes by - all of the buttons on the table/view nodes and the columns.
- **zoomToFit** We instruct the surface to zoom so that everything is visible after the data is loaded.

[TOP](#top)

---

<a name="view"></a>
#### View

The view contains the definitions of node/edge appearance and behaviour:

```javascript
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
  }
```

<a name="initialisation"></a>
#### Initialisation

The `ngAfterViewInit` method of the database visualizer component looks like this:

```javascript
ngAfterViewInit() {
    this.surface = this.surfaceComponent.surface;
    this.toolkit = this.surface.getToolkit();
}
```

[TOP](#top)

---

<a name="rendering-tables-and-views"></a>
#### Rendering Tables and Views

Tables and Views are represented in the data model as types of node. In the view shown above, we see a mapping 
for each of these node types to their respective components:

```
nodes: {
  "table": {
    component: TableNodeComponent
  },
  "view": {
    component: ViewNodeComponent
  }
},
```

The two node types - view and table - extend `BaseEditableNodeComponent`, which offers methods to handle the removal of
 a node, and editing a node's name.

 
```javascript 
export class BaseEditableNodeComponent extends BaseNodeComponent {
  
  editName():void {
    Dialogs.show({
      id: "dlgName",
      data: this.getNode().data,
      title: "Edit " + this.getNode().data.type + " name",
      onOK: (data:any) => {
        if (data.name && data.name.length > 2) {
          // if name is at least 2 chars long, update the underlying data and
          // update the UI.
          this.updateNode(data);
        }
      }
    });
  }

  remove():void {
    Dialogs.show({
      id: "dlgConfirm",
      data: {
        msg: "Delete '" + this.getNode().id
      },
      onOK: (data:any) => {
        this.removeNode();
      }
    });
  }
}
```

##### TableNodeComponent

```javascript
import {Component} from "@angular/core";
import {Dialogs} from "jsplumbtoolkit";
import {BaseEditableNodeComponent} from "./base-editable-node";

@Component({ templateUrl:"templates/table.html" })
export class TableNodeComponent extends BaseEditableNodeComponent {

  addColumn():void {
    Dialogs.show({
      id: "dlgColumnEdit",
      title: "Column Details",
      onOK: (data:any) =>{
        // if the user supplied a column name, tell the toolkit to add a new port, providing it the
        // id and name of the new column.  This will result in a callback to the portFactory defined above.
        if (data.name) {
          if (data.name.length < 2)
            alert("Column names must be at least 2 characters!");
          else {
            this.addNewPort("column", {
              id: jsPlumbUtil.uuid(),                              
              name: data.name.replace(" ", "_").toLowerCase(),
              primaryKey: data.primaryKey,
              datatype: data.datatype
            });
          }
        }
      }
    });
  }
}
```


```xml
<div class="table node">
  <div class="name">
    <div class="delete" title="Click to delete" (click)="remove()">
      <i class="fa fa-times"></i>
    </div>
    <span>{{ obj.name }}</span>
    <div class="buttons">
      <div class="edit-name" title="Click to edit table name" (click)="editName()">
        <i class="fa fa-pencil"></i>
      </div>
      <div class="new-column add" title="Click to add a new column" (click)="addColumn()">
        <i class="fa fa-plus"></i>
      </div>
    </div>
  </div>
  <ul class="table-columns">
    <db-column *ngFor="let column of obj.columns" [obj]="column" [parent]="this"></db-column>
  </ul>
</div>

```

One important piece of this template is the way that columns are rendered:

```xml
<ul class="table-columns">
    <db-column *ngFor="let column of obj.columns" [obj]="column" [parent]="this"></db-column>
  </ul>
```

Below, we discuss the`ColumnComponent` used to render each table column. It is declared with a `selector` of `db-column`. In this part of the template, we loop
through the `columns` member of a node's data, and render a `ColumnComponent` for each column found. The two attributes shown here are both always required - they are expected by `BasePortComponent`:

- **[obj]="column"** The data for the port must be presented as `obj` to the port renderer component
- **[parent]="this"** The port component expects a `parent` to be passed in, which must be of type `BaseNodeComponent`.

Angular will track the `columns` array and render `ColumnComponent` objects as necessary.

##### ViewNodeComponent

```javascript
import {Dialogs} from "jsplumbtoolkit";
import {BaseEditableNodeComponent} from "./base-editable-node";
import {Component} from "@angular/core";

@Component({ templateUrl:"templates/view.html" })
export class ViewNodeComponent extends BaseEditableNodeComponent {
  editQuery():void {
    Dialogs.show({
      id: "dlgViewQuery",
      data: this.getNode().data,
      onOK: (data:any) => {
        this.updateNode(data);
      }
    });
  }
}
```

```xml
<div class="view node">
  <div class="name">
    <div class="view-delete" title="Click to delete" (click)="remove()">
      <i class="fa fa-times"></i>
    </div>
    <span>{{obj.name}}</span>
    <div class="buttons">
      <div class="edit-name" title="Click to edit view name" (click)="editName()">
        <i class="fa fa-pencil"></i>
      </div>
    </div>
  </div>
  <div class="view-edit" title="Click to edit view query" (click)="editQuery()">
    <i class="fa fa-pencil"></i>
  </div>
  <div class="view-details">{{obj.query}}</div>
</div>

```

<a name="rendering-columns"></a>
### Rendering Table Columns

Columns are rendered using the `ColumnComponent`. It is mapped in the view shown above:

```
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
```

The code for the ColumnComponent is:

```
import {Dialogs} from "jsplumbtoolkit";
import {Component, ElementRef} from "@angular/core";
import {BasePortComponent} from "jsplumbtoolkit-angular";

@Component({
  selector:"db-column",
  templateUrl:"templates/column.html"
})
export class ColumnComponent extends BasePortComponent {

  constructor(el: ElementRef) {
    super(el);
  }

  remove():void {
    Dialogs.show({
      id: "dlgConfirm",
      data: {
        msg: "Delete column '" + this.getPort().data.name + "'"
      },
      onOK: (data) => {
        this.parent.toolkit.removePort(this.parent.getNode(), this.getPort().id);
      }
    });
  }

  editName():void {
    Dialogs.show({
      id: "dlgColumnEdit",
      title: "Column Details",
      data: this.getPort().data,
      onOK: (data:any) => {
        // if the user supplied a column name, tell the toolkit to add a new port, providing it the
        // id and name of the new column.  This will result in a callback to the portFactory defined above.
        if (data.name) {
          if (data.name.length < 2)
            Dialogs.show({id: "dlgMessage", msg: "Column names must be at least 2 characters!"});
          else
            this.updatePort({
              name: data.name.replace(" ", "_").toLowerCase(),
              primaryKey: data.primaryKey,
              datatype: data.datatype
            });
        }
      }
    });
  }
}

```

Most importantly here, note that it extends `BasePortComponent`. This is a requirement of the Toolkit.

```xml
<li class="table-column table-column-type-{{obj.datatype}}" attr.primary-key="{{obj.primaryKey}}" attr.data-port-id="{{obj.id}}">
  <div class="table-column-edit" (click)="editName()">
    <i class="fa fa-pencil table-column-edit-icon"></i>
  </div>
  <div class="table-column-delete" (click)="remove()">
    <i class="fa fa-times table-column-delete-icon"></i>
  </div>
  <div><span>{{obj.name}}</span></div>
  <!--
      configure the li as an edge source, with a type of column, a scope derived from
      the columns datatype, and a filter that prevents dragging new edges from the delete button or from the label.
  -->
  <jtk-source attr.port-id="{{obj.id}}" attr.scope="{{obj.datatype}}" filter=".table-column-delete, .table-column-delete-icon, span, .table-column-edit, .table-column-edit-icon" filter-exclude="true"></jtk-source>
  <!--
      configure the li as an edge target, with a type of column, and a scope derived from the
      column's datatype.
  -->
  <jtk-target attr.port-id="{{obj.id}}" attr.scope="{{obj.datatype}}"></jtk-target>
</li>


```

[TOP](#top)

---


<a name="dragging"></a>
#### Dragging New Nodes

As discussed above, a `jsplumb-palette` is declared, which configures all of its child `li` elements to be droppable onto the Surface canvas.  When a drop occurs, the type of the newly dragged node is calculated by the `typeExtractor` method declared on the demo component:

```javascript
typeExtractor(el:Element) {
    return el.getAttribute("jtk-node-type");
}
```

and some suitable initial data for the node is then created by the `dataGenerator` method:

```javascript
dataGenerator(type:string, el:Element) {
    return {
      type:el.getAttribute("data-node-type")
    }
}
```

[TOP](#top)

---

<a name="behaviour"></a>
### Behaviour

This application uses the Toolkit's [dialogs](dialogs) import to manage simple interactions with data members such as this. Your application may choose to use a different mechanism.

#### Edit node name

`BaseEditableNodeComponent` itself extends `BaseNodeComponent`, which comes with the Toolkit's Angular integration. In the code above, note the calls to `this.getNode()` - `BaseNodeComponent` offers this method to access the node that the component is rendering. We [show a dialog](dialogs) populated with the current name. If the user clicks OK, and the new name for the node is more than two characters long, we call `this.updateNode(data)`. `updateNode` is another method offered by `BaseNodeComponent`.
 
```xml
<div class="edit-name" title="Click to edit table name" (click)="editName()">
    <i class="fa fa-pencil"></i>
</div>
```

#### Remove node

Again, here we call `this.getNode()` to get the current node, then show a dialog. If the user clicks OK, we call `this.removeNode()`, which is a method offered by `BaseNodeComponent`.

```xml
<div class="delete" title="Click to delete" (click)="remove()">
  <i class="fa fa-times"></i>
</div>
```

#### Add Column (Table node)

```xml
<div class="new-column add" title="Click to add a new column" (click)="addColumn()">
    <i class="fa fa-plus"></i>
</div>
```

```javascript
addColumn():void {
    Dialogs.show({
      id: "dlgColumnEdit",
      title: "Column Details",
      onOK: (data:any) =>{
        // if the user supplied a column name, tell the toolkit to add a new port, providing it the
        // id and name of the new column.  This will result in a callback to the portFactory defined above.
        if (data.name) {
          if (data.name.length < 2)
            alert("Column names must be at least 2 characters!");
          else {
            this.addNewPort("column", {
              id: jsPlumbUtil.uuid(),                              
              name: data.name.replace(" ", "_").toLowerCase(),
              primaryKey: data.primaryKey,
              datatype: data.datatype
            });
          }
        }
      }
    });
  }
```

We show a dialog prompting the user for the column name, its datatype, and whether or not it is the primary key. If the column name is 2 or more characters long, we then add the new column to the node (this method `addColumn` is declared on the `TableNodeComponent`) with this call:

```javascript
this.addNewPort("column", {
  id: jsPlumbUtil.uuid(),
  name: data.name.replace(" ", "_").toLowerCase(),
  primaryKey: data.primaryKey,
  datatype: data.datatype
});
```

`addNewPort` is a method declared on `BaseNodeComponent`. It is a convenience wrapper around the Toolkit's method of the same name - it first resolves the current node, before calling the Toolkit:

```javascript
this.toolkit.addNewPort(this.getNode(), "column", {
  id: jsPlumbUtil.uuid(),
  name: data.name.replace(" ", "_").toLowerCase(),
  primaryKey: data.primaryKey,
  datatype: data.datatype
});
```

The Toolkit adds the new port to the data model, and then it needs to insert the port into the node somehow. This is where `portDataProperty`, declared on the Toolkit constructor params, comes into play: the Toolkit can infer from the presence of that property that the backing data for this port should be appended to the list of ports in the `columns` of the given node's backing data.

Angular is, of course, tracking the `columns` array, since it is a member of the data object used to render the node originally. So Angular detects the presence of this new column, and creates `ColumnComponent` in response, appending it to the UI.
  
The new column is appended to the end of the `columns` array, meaning it appears at the bottom of the node in the UI. If you want to control the order of ports on a given node, you can also supply a `portOrderProperty` to the Toolkit constructor:
 
```javascript
portDataProperty:"columns",
portOrderProperty:"sortOrder"
```

The Toolkit will then sort the ports according to a comparator that compares the value stored against `sortOrder` in each port's data. Imagine you wanted to put the primary key column always at the top. You might have these two column data objects, with `sortOrder` (which must be a numerical value) determining their placement:

```javascript
columns:[
    {
        "id":"name",
        "datatype":"varchar(50)",
        "sortOrder":"1"
    },
    {
        "id":"id",
        "primaryKey":true,    
        "sortOrder":0,
        "datatype":"integer"
    }
]
```

#### Edit query (View node)

```xml
<div class="view-edit" title="Click to edit view query" (click)="editQuery()">
    <i class="fa fa-pencil"></i>
  </div>
```

```javascript
editQuery():void {
    Dialogs.show({
      id: "dlgViewQuery",
      data: this.getNode().data,
      onOK: (data:any) => {
        this.updateNode(data);
      }
    });
  }
```

Here we show a dialog with a text area for editing the view, subsequently calling `updateNode` if the user presses OK. 

#### Remove Edge

This is handled in the same way by this demo as it is in the original Database Visualizer.

We register a `tap` listener on edges by providing it as an event handler to the View, on the edge type that acts as the parent type for all others. First a helper method (on the demo component, not on Nodes as the previous two examples were):

```javascript
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
      }
```


#### Editing Edge Label

The code above shows a `dbltap` listener declared on all edges, which calls `this._editEdge(params.edge)`:

```javascript
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
```

This method is used in two ways - when `isNew` is null, or false, as it is in this case, the edge is an existing edge. 

<a name="edit-new-edge"></a>

When `isNew` is true, it means the edge has been newly dragged between two nodes. In this latter case, if the user presses cancel on the popup, the edge is removed from the dataset.
  

[TOP](#top)

---


<a name="selecting"></a>
#### Selecting Nodes

Lasso selection is enabled by default on the Surface widget.  To activate the lasso, click the pencil icon in the toolbar:

![Lasso Select Mode](select-lasso.png)

This icon (and the others in the toolbar) are rendered by the `jsplumb-controls` component, which was written for our demonstrations - the code is shown [below](#controls-component)


##### Lasso Operation

The lasso works in two ways: when you drag from left to right, any node that intersects your lasso will be selected.  When you drag from right to left, only nodes that are enclosed by your lasso will be selected.

![Lasso Operation](lasso-select-operation.png)

##### Exiting Select Mode

The Surface widget automatically exits select mode once the user has selected something. The `jsplumb-controls` component also listen to clicks on the whitespace in the widget (in the flowchart component) and when one is detected, it clears the current selection in the underlying Toolkit:

```javascript
ngAfterViewInit() {
    ...
    this.surface.bind("canvasClick", () => this.surface.getToolkit().clearSelection());
    ...
}
```

##### Zoom To Fit

The controls component also provides the "zoom to fit" button (as shown in the component declaration discussed above).

##### Undo/redo

The controls component attaches an [Undo/redo manager](https://docs.jsplumbtoolkit.com/toolkit/current/articles/undo-redo) to the underlying Toolkit instance, to offer undo/redo support for node, group, port and edge additions and/or removals.
 

[TOP](#top)

---

### Dataset Component

This component dumps the current contents of the dataset in syntax highlighted json. This component can be found in the file `dataset.ts`.


#### Declaration
```javascript
@Component({
  selector:"jsplumb-dataset",
  template:'<div class="jtk-demo-dataset"></div>'
})
```

Not a lot going on here - just a div with an appropriate class. This component draws directly into its DOM element.
 
#### Implementation

```javascript
export class DatasetComponent {
  toolkit:jsPlumbToolkit;
  updateListener:Function;

  @Input() toolkitId:string;

  constructor(private el: ElementRef, private $jsplumb:jsPlumbService) { }

  ngOnInit() {
    this.toolkit = this.$jsplumb.getToolkit("flowchart");
    this.updateListener = this.updateDataset.bind(this);
    this.toolkit.bind("dataUpdated", this.updateListener);
  }

  getNativeElement(component:any) {
    return (component.nativeElement || component._nativeElement || component.location.nativeElement).childNodes[0];
  }

  updateDataset() {

    let json = _syntaxHighlight(JSON.stringify(this.toolkit.exportData(), null, 4));
    this.getNativeElement(this.el).innerHTML = json;
  }

  ngAfterViewInit() {
    this.updateDataset();
  }

  ngOnDestroy() {
    this.toolkit.unbind("dataUpdated", this.updateListener);
  }
}
```

The component binds to the Toolkit's `dataUpdated` method, which is fired whenever any change is made to the data model. In the `ngOnDestroy` method (which is called every time the user switches to the flowchart route), the event listener is unbound.  We use a helper method called `_syntaxHighlight` along with a few CSS rules to do the syntax highlighting. The implementation of this method is not in the scope of this document, but you can find the code in the licensed or evaluation download.


[TOP](#top)

---

<a name="controls-component"></a>
### Controls Component

```
import { Input, Component, ElementRef } from '@angular/core';

import {jsPlumbToolkitUndoRedo} from "jsplumbtoolkit-undo-redo";
import {jsPlumb, Surface} from "jsplumbtoolkit";
import {jsPlumbService} from "jsplumbtoolkit-angular";

//
// This component was written for the jsPlumb Toolkit demonstrations. It's production ready of course, but it assumes that
// font awesome is available, and it assumes a couple of other styles are available (via jsplumbtoolkit-demo.css), and it has
// hardcoded labels in English. Plus it assumes that the undo manager is available.


@Component({
  selector:"jsplumb-controls",
  template:`<div class="controls">
              <i class="fa fa-arrows selected-mode" mode="pan" title="Pan Mode" (click)="panMode()"></i>
              <i class="fa fa-pencil" mode="select" title="Select Mode" (click)="selectMode()"></i>
              <i class="fa fa-home" reset title="Zoom To Fit" (click)="zoomToFit()"></i>
              <i class="fa fa-undo" undo title="Undo last action" (click)="undo()"></i>
              <i class="fa fa-repeat" redo title="Redo last action" (click)="redo()"></i>
          </div>`
})
export class ControlsComponent {

  @Input() surfaceId: string;

  surface:Surface;
  undoManager:jsPlumbToolkitUndoRedo;

  constructor(private el: ElementRef, private $jsplumb:jsPlumbService) { }

  getNativeElement(component:any) {
    return (component.nativeElement || component._nativeElement || component.location.nativeElement).childNodes[0];
  }

  panMode() {
    this.surface.setMode("pan");
  }

  selectMode() {
    this.surface.setMode("select");
  }

  zoomToFit() {
    this.surface.getToolkit().clearSelection();
    this.surface.zoomToFit();
  }

  undo() {
    this.undoManager.undo();
  }

  redo() {
    this.undoManager.redo();
  }

  ngAfterViewInit() {
    this.$jsplumb.getSurface(this.surfaceId, (s:Surface) => {

      this.surface = s;
      this.surface.bind("modeChanged", (mode:String) => {
        let controls = this.getNativeElement(this.el);
        jsPlumb.removeClass(controls.querySelectorAll("[mode]"), "selected-mode");
        jsPlumb.addClass(controls.querySelectorAll("[mode='" + mode + "']"), "selected-mode");
      });

      this.undoManager = new jsPlumbToolkitUndoRedo({
        toolkit:this.surface.getToolkit(),
        compound:true,
        onChange:(mgr:jsPlumbToolkitUndoRedo, undoSize:number, redoSize:number) => {
          let controls = this.getNativeElement(this.el);
          controls.setAttribute("can-undo", undoSize > 0);
          controls.setAttribute("can-redo", redoSize > 0);
        }
      });

      this.surface.bind("canvasClick", () => this.surface.getToolkit().clearSelection());

    });
  }
}


```


[TOP](#top)

---

<a name="dialogs"></a>
### Dialogs

The dialogs used in this app are part of the jsPlumb Toolkit core. They provide a simple abstraction around the business of getting input from the user and dealing with it; they're not necessarily fully-featured enough for all applications.

#### Initialization

To initialize the dialogs, we call `jsPlumbToolkit.Dialogs.initialize`, with an appropriate selector for the templates for your dialogs (see below for an explanation of this). In this application we do this in the constructor of the application module (`src/app.module.ts`):

```javascript

import { Dialogs } from "jsplumbtoolkit"

...

export class AppModule { 
    constructor() {
        // initialize dialogs
        Dialogs.initialize({
            selector: ".dlg"
        });
    }
}
```

#### Templates

Each dialog has a template in the HTML, with some class name that you matched in the `selector` argument to the `initialize` call above:

```xml
<script type="jtk" class="dlg" id="dlgViewQuery" title="Edit Query">
  <textarea class="txtViewQuery" jtk-focus jtk-att="query">${query}</textarea>
</script>
```

##### Binding Parameters

These templates use the same template engine as the Surface renderer, so in this example you can see we've extracted `query` from the View node's data, and injected it into the textarea. But what might not be immediately obvious is the purpose of the `jtk-att` attribute: it tells the dialog handler that the value of this textarea should be passed to the OK handler, using the key `query`.

Note also in the above example, the `jtk-focus` attribute: this tells the dialog handler that the textarea should be given the focus when the dialog first opens.

#### Showing a dialog

This example is the dialog that is shown when you edit a View query. We provide the id of the template to use for the dialog, and we provide the View node's data as the backing data for the dialog. Then we provide an `onOK` callback:

```javascript
Dialogs.show({
  id:"dlgViewQuery",
  data:this.getNode().data,
  onOK:(data:any) => {
    // update data
    this.toolkit.updateNode(this.getNode(), data);
  }
});
```
The `data` argument to the `onOK` callback consists of an object whose key value pairs are determined by the `jtk-att` attributes found in the template. Recall that above we had a textarea with `jtk-att:"query"`. This means that the `data` argument to `onOK` looks like this:

```javascript
{
  query:"the contents of the text area"
}
```

##### Supported Input Types

The list of supported input types is:

- text
- radio button(s) 
- checkbox
- select
- textarea

##### Dialog Titles

If you set a `title` attribute on a dialog's template, that value will be used for the title of the dialog. Alternatively, you can provide a `title` parameter to the `show` call.

##### Lifecycle Callbacks

There are three lifecycle callbacks supported:

- **onOpen** Called when the dialog has been opened. The related DOM element for the dialog is passed to this method.
- **onOK** Called when the user presses OK. The callback is provided a data object as discussed above.
- **onCancel** Called when the user presses cancel. No arguments are provided to the callback.

[TOP](#top)
