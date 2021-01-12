import { Component, OnInit } from '@angular/core';
import { User, Table, UserFilter, UserDto } from '@models';
import { Store, Select } from '@ngxs/store';
import { FetchUserList, GetUser } from '@actions';
import { UserState } from '@states';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { USER_STATUSES } from '@enums';
import { UserStatusPipe } from 'app/shared/pipes';

@Component({
  selector: 'dashboard-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UserStatusPipe],
})
export class UsersComponent implements OnInit {
  @Select(UserState.user) user$: Observable<User>;

  userList: Array<User>;
  tableData: Table.Data;
  userForm: FormGroup;
  user: User;
  USER_STATUSES = USER_STATUSES;
  hasUserActived: boolean;

  constructor(private store: Store, private userStatusPipe: UserStatusPipe) {}

  ngOnInit() {
    this.userForm = new FormGroup({
      id: new FormControl(null),
      lastName: new FormControl({ value: null, disabled: true }, [Validators.required]),
      firstName: new FormControl({ value: null, disabled: true }, [Validators.required]),
      email: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.email]),
    });
    this.updateList();
  }

  onSelect(id: string) {
    const filter: UserFilter = { id };
    this.store.dispatch(new GetUser(filter)).subscribe(() => {
      this.user = this.store.selectSnapshot<UserDto>(UserState.user) as User;
      const { id, lastName, firstName, email, status } = this.user;
      this.userForm.setValue({ id, lastName, firstName, email });
      this.hasUserActived = this.user.status === USER_STATUSES.ACTIVED || this.user.status === USER_STATUSES.PAID;
    });
  }

  onReset() {
    this.store.reset(UserState.user);
  }

  private updateList() {
    this.store.dispatch(new FetchUserList({})).subscribe(() => {
      this.userList = this.store.selectSnapshot<Array<User>>(UserState.userList);

      const items = this.userList.map<Table.Item>(item => ({
        id: item.id,
        values: [`${item.lastName} ${item.firstName}`, item.email, this.userStatusPipe.transform(item.status)],
      }));

      this.tableData = {
        fields: ['ФИО', 'Email', 'Статус'],
        items,
      };
    });
  }

  /** Временные заглушки */
  onRemove() {}

  onAdd() {}

  onBlock() {}
}
