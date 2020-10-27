import { Component, ViewChild,AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  name = 'Angular 6';
  @ViewChild('editor') editor;

  ngAfterViewInit() {

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
      exec: function (editor) {

      }
    })
  }

  getValue() {
    console.log(this.editor.value)
    console.log(eval(this.editor.value));
  }
}
