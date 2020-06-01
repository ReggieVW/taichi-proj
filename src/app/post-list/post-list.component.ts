import { Component, OnInit } from '@angular/core';
import { RestAPIService } from '../rest-api.service';
//import {PostListSingleComponent} from './post-list.component.spec';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts:any;
  constructor(private api: RestAPIService) { }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(){
    this.api.getPosts().subscribe( data=>{
      this.posts = data;
    })
  }

}
