import { Component, OnInit } from '@angular/core';
import { RestAPIService } from '../rest-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-single',
  templateUrl: './post-single.component.html',
  styleUrls: ['./post-single.component.css']
})
export class PostSingleComponent implements OnInit {

  post_id: any;
  post: any;

  constructor(private api: RestAPIService, private route: ActivatedRoute) { 
    if(this.route.snapshot.params){
      this.post_id = this.route.snapshot.params.id;
    }
  }

  ngOnInit(): void {
    this.api.getPostBySlug(this.post_id).subscribe( data=>{
      this.post = data[0];
    });
  }

}
