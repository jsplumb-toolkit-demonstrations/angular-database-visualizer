import { Input, Component, ElementRef } from '@angular/core';

import {jsPlumbToolkitUndoRedoManager, createUndoRedoManager} from "@jsplumbtoolkit/undo-redo";
import {Surface} from "@jsplumbtoolkit/browser-ui";
import {jsPlumbService} from "@jsplumbtoolkit/angular";

// --------------------------------------- CONTROLS COMPONENT ------------------------------------------------------------------
//
// This component was written for the jsPlumb Toolkit demonstrations. It's production ready of course, but it assumes a couple of
// other styles are available (via jsplumbtoolkit-demo-support.css), and it has
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
  undoManager:jsPlumbToolkitUndoRedoManager;

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
    this.surface.toolkitInstance.clearSelection();
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
        // jsPlumb.removeClass(controls.querySelectorAll("[mode]"), "selected-mode");
        // jsPlumb.addClass(controls.querySelectorAll("[mode='" + mode + "']"), "selected-mode");
      });

      this.undoManager = createUndoRedoManager({
        surface:this.surface,
        compound:true,
        onChange:(mgr:jsPlumbToolkitUndoRedoManager, undoSize:number, redoSize:number) => {
          let controls = this.getNativeElement(this.el);
          controls.setAttribute("can-undo", undoSize > 0);
          controls.setAttribute("can-redo", redoSize > 0);
        }
      });

      this.surface.bind("canvasClick", () => this.surface.toolkitInstance.clearSelection());

    });
  }
}


// -------------------------------------------- / CONTROLS COMPONENT ----------------------------------------------------
