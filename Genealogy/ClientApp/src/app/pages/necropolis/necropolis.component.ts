import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Cemetery, Paginator, Person, PersonFilter, Table } from '@models';
import { ClearPersonList, FetchCemeteryList, FetchPersonList } from '@actions';
import { CemeteryState, MainState, PersonState } from '@states';
import { isNil } from 'lodash';
import { NotifierService } from 'angular-notifier';
import { NOTIFICATIONS } from '@enums';
import { FeedbackComponent } from '@shared';

@Component({
  selector: 'app-necropolis',
  templateUrl: './necropolis.component.html',
  styleUrls: ['./necropolis.component.scss'],
})
export class NecropolisComponent implements OnInit {
  @ViewChild(FeedbackComponent, { static: false }) feedbackModal: FeedbackComponent;

  personList: Array<Person> = null;
  searchForm: FormGroup;
  hasAuth: boolean = false;

  tableData: Table.Data;
  paginatorOptions: Paginator = {
    index: 0,
    step: 10,
    count: 0,
  };

  cemeteries: Array<{ id: string; name: string }>;

  constructor(private store: Store, private notifierService: NotifierService) {}

  ngOnInit() {
    this.hasAuth = this.store.selectSnapshot(MainState.hasAuth);

    this.searchForm = new FormGroup({
      fio: new FormControl(null, [Validators.required]),
      cemeteryId: new FormControl(null, [Validators.required]),
    });

    if (this.hasAuth) {
      this.store.dispatch(new FetchCemeteryList()).subscribe(() => {
        const cemeteryList = this.store.selectSnapshot(CemeteryState.cemeteryList);
        this.cemeteries = cemeteryList.map(({ id, name }) => ({ id, name }));
      });
    }

    this.store.dispatch(new ClearPersonList());
  }

  search() {
    const { fio, cemeteryId } = this.searchForm.value;

    if (!isNil(fio) && !isNil(cemeteryId)) {
      const { index, step } = this.paginatorOptions;
      const filter: PersonFilter = { fio: fio.toLowerCase(), cemeteryId, index, step };

      this.store.dispatch(new FetchPersonList(filter)).subscribe(() => {
        this.personList = this.store.selectSnapshot<Array<Person>>(PersonState.personList);

        this.paginatorOptions.count = this.personList.length;

        const items = this.personList.map<Table.Item>(item => ({
          id: item.id,
          values: [
            `${item.lastname} ${item.firstname} ${item.patronymic}`,
            item.startDate,
            item.finishDate,
            item.cemetery ? item.cemetery.name : null,
          ],
          isRemoved: item.isRemoved,
        }));

        this.tableData = {
          fields: ['ФИО', 'Дата рождения', 'Дата смерти', 'Место захоронения'],
          items,
        };
      });
    } else {
      this.notifierService.notify('error', NOTIFICATIONS.INVALID_FORM, 'INVALID_FORM');
    }
  }

  onSelect(id) {}
  
  onOrderButtonClick() {
    this.feedbackModal.open('Некрополистическое исследование');
  }
}
