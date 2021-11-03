
import {BaseEditableNodeComponent} from "./base-editable-node";
import {Component} from "@angular/core";
import {DatabaseVisualizerService} from "./database.visualizer.service"

@Component({ templateUrl:"templates/view.html" })
export class ViewNodeComponent extends BaseEditableNodeComponent {

  constructor(protected service:DatabaseVisualizerService) {
    super(service)
  }

  editQuery():void {
    this.service.showDialog({
      id: "dlgViewQuery",
      data: this.getNode().data,
      onOK: (data:any) => {
        this.updateNode(data);
      }
    });
  }
}
