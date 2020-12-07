import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbIconConfig, NbMenuItem, NbMenuService, NbSidebarService } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { ConnectpartService } from 'src/app/connectpart.service';
import { fileInterface, TreeNode } from 'src/app/fileInterface';
import { NewfiledialogComponent } from 'src/app/newfiledialog/newfiledialog.component';
import { User } from 'src/app/UserDetails';
import { ApiService } from '../../api.service';
import { CodeService } from '../../code-compile-service.service';
import { code_interface, output_interface} from '../../code_interface';
// import { threadId } from 'worker_threads';
import {Location} from '@angular/common'; 
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  user: User;
  input='';
  output='';
  cli='';
  lang = 'python';
  status:string= 'Run after passing in input';
  code_data: code_interface;
  code = "";
  fileid = '';
  filename = 'New File';
  @ViewChild('editor') editor;
  constructor(private router: Router, private _dialogService: NbDialogService, private location: Location,private api: ApiService, private _fileService: CodefetchService,private sidebarService: NbSidebarService, private _codeService: CodeService, private _connect: ConnectpartService, private _route : ActivatedRoute){}

  ngAfterViewInit() {
    // console.log(this._codestore.getid());
    this.api.getDetails().subscribe(
      user => this.user = user
    );
    this.fileid = this._route.snapshot.paramMap.get('id');
    if(this.fileid == null)
      this.fileid = "-1";
    console.log(this.fileid);
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

    // this.location.onUrlChange(this.changeFile);
    // this.location.events.subscribe(this.changeFile)
    if(this.fileid != "-1") {
        this._fileService.readfiledata(this.fileid).subscribe(
          _data => {
            if(_data['success']==false) {
              this._fileService.handleError(_data['message'],this._fileService.toastrService);
            }
            else {
              console.log(_data)
              // this._codestore.setcode(this.fileid, _data['data']);
              this.code = _data['data'];
              this.editor.value = this.code;
              this.filename = _data["filename"];
            }
          }
        )
    }

    this._connect.setactivefile(this.fileid);
    // this._connect.buildTable();
    this.sidebarService.expand('code');
    this.editor.value = this.code;
  }

  get language(){
    return this.lang;
  }

  set language(val){
    if(val=='c' || val == 'c++')
      this.editor.mode = 'c_cpp';
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
    console.log(this.fileid)
    if(this.fileid == "-1") {
      this._dialogService.open(NewfiledialogComponent, {context: {par: "-1"}}).onClose.subscribe(
        async data => {
          if (data) { 
            console.log("creating file")
            let d =  await this._fileService.createFile(data[2],data[0],data[1])
            console.log(d)         
            if (d) {
               console.log("file created")
               this.fileid =  d;
               this._fileService.updatefile(this.fileid, this.editor.value);
              //  this.location.navigate(['/dashboard/editor',{id: this.fileid}], {
              //   skipLocationChange: true
              //   // do not trigger navigation
              // });  
              // this.location.replaceState
              // const url = this.router.createUrlTree([], {relativeTo: this._route, queryParams: {param: 1}}).toString()
              // this.location.go(url);
              this.location.go('/dashboard/editor;id='+this.fileid)
              console.log("table built")
              try{
              this._connect.buildTable()
              }
              finally{}
            }
          }
          // console.log(data[2]);
        }
      )
    }
    else
      this._fileService.updatefile(this.fileid, this.editor.value);
    // this.input = this.editor.value;
    // this.output = this.lang;
  }

  run() {
    this.save();
    this.code_data = {input_type:'TEXT', input: this.input, lang: this.language, command: this.cli, file_id: this.fileid};

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
