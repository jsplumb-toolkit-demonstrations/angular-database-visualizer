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
