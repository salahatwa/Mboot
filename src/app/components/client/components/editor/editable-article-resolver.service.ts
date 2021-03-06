import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { catchError ,  map } from 'rxjs/operators';
import { Article } from '../../entities';
import { ArticlesService } from '../../services';
import { UserService } from './../../../../shared/shared-services/core';

@Injectable()
export class EditableArticleResolver implements Resolve<Article> {
  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private userService: UserService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    return this.articlesService.get(route.params['slug'])
      .pipe(
        map(
          article => {
            if (this.userService.getCurrentUser().profile.username === article.author.username) {
              return article;
            } else {
              this.router.navigateByUrl('/');
            }
          }
        ),
        catchError((err) => this.router.navigateByUrl('/'))
      );
  }
}
