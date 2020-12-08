import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { fileInterface } from 'src/app/fileInterface';
import { CodeService } from '../../code-compile-service.service';
import { code_interface } from '../../code_interface';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  input='';
  output='';
  cli='';
  lang = 'python';
  status:string= 'Run after passing in input';
  code_data: code_interface;

  @ViewChild('editor') editor;
  constructor(private _fileService: CodefetchService,
              private sidebarService: NbSidebarService,
              private _codeService: CodeService){}

  get openedFile(): fileInterface {
    let ret = this._fileService.openedFile
    if (this.editor != undefined) this.editor.setReadOnly(ret.id == -1);
    return ret;
  }
  get openedFileData(): string {
    return this._fileService.openedFileData;
  }

  ngAfterViewInit() {

    this.editor.getEditor().setOptions({
      showLineNumbers: true,
      tabSize: 2,
      fontSize: 18,
      enableBasicAutocompletion: true
    });

    this.editor.setTheme('dracula');

    this.editor.mode = 'python';

    this.editor.getEditor().commands.addCommand({
      name: 'showOtherCompletions',
      bindKey: 'Ctrl-.',
      exec: function (editor) {
      }
    })
    this.sidebarService.expand('code');
  }

  get language(){
    return this.lang;
  }

  set language(val){
    if(val=='c' || val == 'c++')
      this.editor.mode = 'c_cpp';
    else if (val == 'python3'){
      this.editor.mode = 'python';
    }
    else
      this.editor.mode = val;
    this.lang = val;
  }

  getValue() {
    console.log(this.editor.value)
    console.log(eval(this.editor.value));
    console.log(this.input)
  }

  save(): boolean {
    if(this.openedFile.id == -1) {
      return false;
    }
    else {
      this._fileService.updatefile(this.openedFile.id.toString(), this.editor.value);
      return true;
    }
  }

  run() {
    if (!this.save()) return;
    this.code_data = {input_type:'TEXT', input: this.input, lang: this.language, command: this.cli, file_id: this.openedFile.id.toString()};

    this.status = 'Running code on server.. ';

    console.log(this.code_data);
    this._codeService.postData(this.code_data).subscribe(
      output_data =>{
        this.output = output_data.output;
        if (output_data.success){
          this.status = 'Successfully executed';
        }
        else {
          this.status = 'There is an error in your code. Check output panel for more details';
        }
      },
      error => {this.status = 'Something went Wrong...'; console.log(error)}
      );
  }
}
