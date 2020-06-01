import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostSingleComponent } from './post-single/post-single.component';
import { PageComponent } from './page/page.component';


const routes: Routes = [
  {
    path:'',
    component: PostListComponent
  },
  {
    path:'posts/:id',
    component: PostSingleComponent
  },
  {
    path:'page/:id',
    component: PageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
