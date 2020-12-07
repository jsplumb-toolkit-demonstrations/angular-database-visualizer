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
