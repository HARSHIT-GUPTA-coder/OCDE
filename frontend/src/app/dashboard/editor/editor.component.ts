import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NbIconConfig, NbMenuItem, NbMenuService, NbSidebarService } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { CodestoreService } from 'src/app/codestore.service';
import { fileInterface, TreeNode } from 'src/app/fileInterface';
import { CodeService } from '../../code-compile-service.service';
import { code_interface, output_interface} from '../../code_interface';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  input="";
  output="";
  cli="";
  lang = "python";
  status:string= "Run after passing in input";
  code_data: code_interface;
  code = this._codestore.getcode();

  @ViewChild('editor') editor;
  constructor(private _codestore: CodestoreService,private sidebarService: NbSidebarService, private _codeService: CodeService, private menuService: NbMenuService, private _fileservice: CodefetchService){}

  ngAfterViewInit() {
    this._fileservice.getFileList().subscribe(
      _data => {
        for(var d of _data){
          this.menuService.addItems([this.treeToMenu(d)],"filelist")
        }
        }
      );
    this.sidebarService.expand('code')
    
    this.editor.getEditor().setOptions({
      showLineNumbers: true,
      tabSize: 2,
      fontSize: 18,
      enableBasicAutocompletion: true
    });

    this.editor.setTheme("dracula");
   
    this.editor.mode = "python";

    this.editor.getEditor().commands.addCommand({
      name: "showOtherCompletions",
      bindKey: "Ctrl-.",
      exec: function (editor) {
 
      }
    })

    this.editor.value = this.code;
  }
  get language(){
    return this.lang;
  }

  set language(val){
    if(val=='c' || val == 'c++')
      this.editor.mode = "c_cpp";
    else
      this.editor.mode = val;
    this.lang = val;
  }

  getValue() {
    console.log(this.editor.value)
    console.log(eval(this.editor.value));
    console.log(this.input)
  }

  save() {
    console.log(this.input);
    this.input = this.editor.value;
    this.output = this.lang;
  }

  run() {
    this.code_data = {type:"TEXT", code: this.editor.value, input_type:"TEXT", input: this.input, lang: this.language,  "args": this.cli};
    
    this.status = "Running code on server.. ";

    console.log(this.code_data);
    this._codeService.postData(this.code_data).subscribe(
      output_data =>{
        this.output = output_data.output;
        if (output_data.success){
          this.status = "Successfully executed";
        }
        else {
          this.status = "There is an error in your code. Check output panel for more details";
        }
      },
      error => {this.status = "Something went Wrong..."; console.log(error)}
      );
  }


  treeToMenu(tree: TreeNode<fileInterface>): NbMenuItem {
    let n:NbMenuItem = {title: tree.data.name};
    if(tree.children) {
      n.children = [];
      for(var t in tree.children){
        n.children.push(this.treeToMenu(tree.children[t]))
      }
    }
    return n;
  }
}
