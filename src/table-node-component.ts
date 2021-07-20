
import {Component} from "@angular/core"
import { uuid } from "@jsplumbtoolkit/core"
import {BaseEditableNodeComponent} from "./base-editable-node"
import {DatabaseVisualizerService} from "./database.visualizer.service"

@Component({ templateUrl:"templates/table.html" })
export class TableNodeComponent extends BaseEditableNodeComponent {

  constructor(protected service:DatabaseVisualizerService) {
    super(service)
  }

  addColumn():void {
    this.service.showDialog({
      id: "dlgColumnEdit",
      title: "Column Details",
      onOK: (data:Record<string, any>) =>{
        // if the user supplied a column name, tell the toolkit to add a new port, providing it the
        // id and name of the new column.  This will result in a callback to the portFactory defined above.
        if (data.name) {
          if (data.name.length < 2)
            alert("Column names must be at least 2 characters!");
          else {
            this.addNewPort("column", {
              id: uuid(),
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
