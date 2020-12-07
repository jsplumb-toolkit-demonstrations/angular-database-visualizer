import {Dialogs} from "jsplumbtoolkit";
import {BaseNodeComponent} from "jsplumbtoolkit-angular";

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
