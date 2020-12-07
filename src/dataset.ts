import {Component, ElementRef, Input} from '@angular/core';
import { jsPlumbToolkit } from "jsplumbtoolkit";
import {jsPlumbService } from "jsplumbtoolkit-angular";

function _syntaxHighlight(json:string) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return "<pre>" + json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,  (match) => {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }) + "</pre>";
}

@Component({
  selector:"jsplumb-dataset",
  template:'<div class="jtk-demo-dataset"></div>'
})
export class DatasetComponent {
  toolkit:jsPlumbToolkit;
  updateListener:Function;

  @Input() toolkitId:string;

  constructor(private el: ElementRef, private $jsplumb:jsPlumbService) { }

  ngOnInit() {
    this.toolkit = this.$jsplumb.getToolkit("dbvis");
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
