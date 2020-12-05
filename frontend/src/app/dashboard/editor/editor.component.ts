import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbIconConfig, NbMenuItem, NbMenuService, NbSidebarService } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { CodestoreService } from 'src/app/codestore.service';
import { ConnectpartService } from 'src/app/connectpart.service';
import { fileInterface, TreeNode } from 'src/app/fileInterface';
import { CodeService } from '../../code-compile-service.service';
import { code_interface, output_interface} from '../../code_interface';
// import { threadId } from 'worker_threads';

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
  fileid = "";
  @ViewChild('editor') editor;
  constructor(private location: Router,private _fileService: CodefetchService ,private _codestore: CodestoreService,private sidebarService: NbSidebarService, private _codeService: CodeService, private _connect: ConnectpartService, private _route : ActivatedRoute){}

  ngAfterViewInit() {
    // console.log(this._codestore.getid());
    this.fileid = this._route.snapshot.paramMap.get('id');
    console.log(this.fileid);
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
    
    // this.location.onUrlChange(this.changeFile);
    // this.location.events.subscribe(this.changeFile)
    if(typeof this._codestore.getid() == "undefined"){
      this._fileService.readfiledata(this.fileid).subscribe(
        _data => {
          if(_data["success"]==false) {
            this._fileService.handleError(_data["message"])
          }
          else {
            console.log(_data)
            this._codestore.setcode(this.fileid, _data["data"]);
            this.code = _data["data"];
            this.editor.value = this.code;
          }
        }
      )
    }

    this._connect.setactivefile(this.fileid);
    this._connect.buildTable();
    this.sidebarService.expand('code')
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
    // this.input = this.editor.value;
    // this.output = this.lang;
    this._fileService.updatefile(this.fileid, this.editor.value);
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


  // treeToMenu(tree: TreeNode<fileInterface>): NbMenuItem {
  //   let n:NbMenuItem = {title: tree.data.name, link: "dashboard/editor;fileId="+tree.data.id};
  //   if(tree.children) {
  //     n.children = [];
  //     for(var t in tree.children){
  //       n.children.push(this.treeToMenu(tree.children[t]))
  //     }
  //   }
  //   return n;
  // }
}
