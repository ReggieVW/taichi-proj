import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WindowService } from './window.service';
import { RestAPIService } from './rest-api.service';
import { HttpClientModule } from '@angular/common/http';
import { PostListComponent } from './post-list/post-list.component';
import { PostListSingleComponent } from './post-list-single/post-list-single.component';
import { PostSingleComponent } from './post-single/post-single.component';
import { PageComponent } from './page/page.component';
import { Covid19Component } from './covid19/covid19.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SoccerComponent } from './component/soccer/soccer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {trigger,state,style,animate,transition}from '@angular/animations';
import { MatSelectModule } from '@angular/material/select';


 
@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostListSingleComponent,
    PostSingleComponent,
    PageComponent,
    Covid19Component,
    SoccerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatSelectModule
  ],
  providers: [WindowService,
  RestAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
