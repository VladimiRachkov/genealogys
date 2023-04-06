import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { MainState } from '../../states/main.state';

@Injectable({ providedIn: 'root' })
export class SubscriptionGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const hasSubscription = this.store.selectSnapshot(MainState.hasSubscription);
    if (hasSubscription) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
    return hasSubscription;
  }
}
