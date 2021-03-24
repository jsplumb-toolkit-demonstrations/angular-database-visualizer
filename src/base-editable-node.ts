
import {BaseNodeComponent} from "@jsplumbtoolkit/angular"

import {DatabaseVisualizerService} from "./database.visualizer.service"

export class BaseEditableNodeComponent extends BaseNodeComponent {


  constructor(protected service:DatabaseVisualizerService) {
    super()
  }

  editName():void {
    this.service.showDialog({
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
    this.service.showDialog({
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
