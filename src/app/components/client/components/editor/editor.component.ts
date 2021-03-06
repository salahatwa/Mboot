import { Component, OnInit, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, ArticleType } from '../../entities';
import { ArticlesService } from '../../services';
import { MatChipInputEvent } from '@angular/material';
import { JoditAngularComponent } from './../../../../shared/shared-components/editor/jodit-angular.component';
import { betweenLength } from '../../utils/validator';
import { JwtService } from './../../../../shared/shared-services/core';
import { environment } from './../../../../../environments/environment';


@Component({
  selector: 'app-editor-page',
  templateUrl: './editor.component.html',
  styleUrls: ['editor.component.css']
})
export class EditorComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild(JoditAngularComponent) joditEditor: JoditAngularComponent;

  //----------------EDITOR CONFIG---------------------

 editorConfig={
  // preset: "inline",
  showPlaceholder:true,
  placeholder: "start typing text ...",
  // uploader: {
  //   "insertImageAsBase64URI": true
  // },
  enableDragAndDropFileToEditor: true,
  sizeLG: 900,
  sizeMD: 700,
  sizeSM: 400,
  buttons: [
      //  '|',
      'bold',
      'strikethrough',
      'underline',
      'italic', '|',
      'ul',
      'ol', '|',
      'outdent', 'indent',  '|',
      'font',
      'fontsize',
      'brush',
      'paragraph', '|',
      'image',
      // 'video',
      'table',
      'link', '|',
      'align', 'undo', 'redo', '|',
      'hr',
      'eraser',
      'copyformat', '|',
      'symbol',
      'fullsize',
      'source'
  ],
  buttonsMD:[ 'bold',
  'strikethrough',
  'underline',
  'italic', '|',
  'ul',
  'ol', '|',
  'outdent', 'indent',  '|',
  'font',
  'fontsize',
  'brush',
  'paragraph', '|',
  'image',
  // 'video',
  'table',
  'link', '|',
  'align', 'undo', 'redo', '|',
  'hr',
  'eraser',
  'copyformat', '|',
  'symbol',
  'fullsize',
  'source'
],
  buttonsSM:[ 'bold',
  'image', '|',
  'brush',
  'paragraph', '|',
  'align', '|',
  'undo', 'redo', '|',
  'eraser',
  'dots'],
  buttonsXS: [
      'bold',
      'image', '|',
      'brush',
      'paragraph', '|',
      'align', '|',
      'undo', 'redo', '|',
      'eraser',
      'dots'
  ],

  uploader: {
    url:  `${environment.api_url}`+'/storage/upload/multiple',
    // url: 'https://mz-backend.herokuapp.com/builder/api/storage/local/uploadMultipleFiles',
    // url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
    // format: 'json',
    filesVariableName: function(e){return "files"},

    insertImageAsBase64URI: false,
    imagesExtensions: [
        "jpg",
        "png",
        "jpeg",
        "gif"
      ],
    withCredentials: true,
    headers: {
       "Authorization": 'Bearer ' + this.jwtService.getToken()
    },

    prepareData: function (data) {
        data.append('id', 24);
        return data;
    },
    isSuccess: function (resp) {
        return resp;
    },
   

    // getMsg: function (resp) {
    //     return resp.msg.join !== undefined ? resp.msg.join(' ') : resp.msg;
    // },
  
    // error: function (e) {
    //     console.log(e);
    //     // this.events.fire('errorPopap', [e.getMessage(), 'error', 4000]);
    // },
   // defaultHandlerSuccess: function (data, resp) {
     //   console.log('2>>>'+JSON.stringify(data)+"@@@@:"+JSON.stringify(resp));
       // this.joditEditor.editor.setMode(2);
               //  this.joditEditor.addElement(data.baseurl);
           
     //},
    // defaultHandlerError: function (resp) {
    //     this.events.fire('errorPopap', [this.editorConfig.uploader.getMsg(resp)]);
    // }
},
//  filebrowser: {
 //    ajax: {
   //      url: 'https://mz-backend.herokuapp.com/builder/api/storage/upload/multiple'
     //}
 //}

}
 


  article: Article = {} as Article;
  articleForm: FormGroup;
  tagField = new FormControl();
  errors: [] ;
  isSubmitting = false;

  disbaledTagUpdate:boolean=false;

  get f() { return this.articleForm.controls; }

  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    protected jwtService: JwtService
  ) {




    // use the FormBuilder to create a form group
    this.articleForm = this.fb.group({
      title: ['', Validators.compose([Validators.required,  Validators.pattern('^(?=.{3,100}$)(?![-_.])(?!.*[-_.]{2})[a-zA-Z0-9-._ ]+(?![-_.])$')])],
      description: ['', Validators.compose([Validators.required])],
      body: ['', Validators.required],
      tagList: this.fb.array([],Validators.compose([betweenLength(0,4)])) ,
    
    });

  }

  ngOnInit() {
    // If there's an article prefetched, load it
    this.route.data.subscribe((data: { article: Article }) => {
      if (data.article) {
        this.article = data.article;

       
        console.log(this.article);
        if(this.article)
        this.disbaledTagUpdate=true;

        

        this.articleForm.patchValue(data.article);

        console.log(data.article.tagList);
        data.article.tagList.forEach(tag=>{
          if(tag&&tag!=null&&tag!='')
          {
            console.log(tag)
            this.tagsArray.push(new FormControl(tag));
          }
        });

       
      }
    });
 // Initialized tagList as empty array
      if(!this.article.tagList)
      this.article.tagList = [];
     

  }

  get tagsArray() {
    return this.articleForm.get('tagList') as FormArray;
 }

add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.article.tagList.push( value.trim());
      this.tagsArray.push(new FormControl(value.trim(),Validators.pattern('^(?=.{1,50}$)(?![-_.])(?!.*[-_.]{2})[a-zA-Z0-9-._ ]+(?![-_.])$')));
    }
    
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tagName: any): void {
    const index = this.article.tagList.indexOf(tagName);

    if (index >= 0) {
      this.article.tagList.splice(index, 1);
      // this.article.tagList = this.article.tagList.filter(tag => tag !== tagName);
      this.tagsArray.removeAt(index);
    }
  }


 
  submitForm() {
    this.isSubmitting = true;

    if(this.articleForm.invalid)
    {
      this.isSubmitting =false;
      return; 
    }
    // update the model
    this.updateArticle(this.articleForm.value);

    // post the changes
    this.articlesService.save(this.article).subscribe(
      article => this.router.navigateByUrl('/article/' + article.slug),
      err => {
        this.errors = err.errors;
        this.isSubmitting = false;
      }
    );
  }

  updateArticle(values: Object) {
    Object.assign(this.article, values);
    this.article.type=ArticleType.NORMAL;
  }
}
