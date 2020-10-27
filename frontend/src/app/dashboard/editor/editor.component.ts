import { Component, ViewChild,AfterViewInit } from '@angular/core';
import {NbIconConfig, NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  input;
  @ViewChild('editor') editor;
  constructor(private sidebarService: NbSidebarService){}

  ngAfterViewInit() {
    this.sidebarService.expand('code')
    this.editor.getEditor().setOptions({
      showLineNumbers: true,
      tabSize: 2,
      enableBasicAutocompletion: true
    });


    this.editor.setTheme("eclipse");

    this.editor.mode = 'javascript';
    this.editor.value = `function testThis() {
  console.log("it's working!")
}`

    this.editor.getEditor().commands.addCommand({
      name: "showOtherCompletions",
      bindKey: "Ctrl-.",
      
    })
  }

  getValue() {
    // console.log("Asadsa")
    console.log(this.editor.value)
    console.log(eval(this.editor.value));
    console.log(this.input)
  }

  save() {
    console.log(this.input);
    this.input = this.editor.value;
  }

  run() {
    console.log(this.input);
  }
}
