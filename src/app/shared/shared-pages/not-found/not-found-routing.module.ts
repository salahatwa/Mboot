import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
{
  path: 'not-found',
  component: NotFoundComponent
}];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
  }),
  ],
  exports: [RouterModule]
})
export class NotFoundRoutingModule { }
