import { Component, OnInit } from '@angular/core';
import { RestAPIService } from '../rest-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  page_id: any;
  page:any;
  constructor(private api:RestAPIService, private route:ActivatedRoute) { 
    if(this.route.snapshot.params){
      this.page_id = this.route.snapshot.params.id;
    }
  }

  ngOnInit(): void {
    this.api.getPage(this.page_id).subscribe(data=>{
      this.page = data;
    })
  }

}
