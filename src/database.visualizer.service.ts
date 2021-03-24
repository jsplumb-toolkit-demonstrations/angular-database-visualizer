import { Injectable } from '@angular/core';
import {Dialogs} from "@jsplumbtoolkit/dialogs"
import {jsPlumbService} from "@jsplumbtoolkit/angular"
import {BrowserUI} from "@jsplumbtoolkit/browser-ui"

@Injectable({
  providedIn: 'root'
})
export class DatabaseVisualizerService {

  private TOOLKIT_ID = "dbVis"
  private dialogs:Dialogs
  private _toolkit:BrowserUI

  constructor(private $jsplumb:jsPlumbService) {
    this.dialogs = new Dialogs({selector:".dlg"})
  }

  showDialog(options:any) {
    this.dialogs.show(options)
  }

  get toolkit():BrowserUI {
    if (this._toolkit == null) {
      this._toolkit = this.$jsplumb.getToolkit(this.TOOLKIT_ID);
    }
    return this._toolkit
  }
}
