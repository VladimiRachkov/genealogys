import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Page, PageFilter, PageDto, Table } from '@models';
import { AddPage, MarkAsRemovedPage, GetPage, UpdatePage, FetchPageList } from '@actions';
import { PageState } from '@states';
import { EditorComponent } from './editor/editor.component';
import { LinkEditorComponent } from './link-editor/link-editor.component';

@Component({
  selector: 'dashboard-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  @ViewChild(LinkEditorComponent, { static: false }) linkEditor: LinkEditorComponent;
  @ViewChild(EditorComponent, { static: false }) editor: EditorComponent;

  pageForm: FormGroup;
  selectedPage: Page;
  tableData: Table.Data;

  closeResult: string = null;

  constructor(private store: Store) {}

  ngOnInit() {
    this.updateList();
    this.pageForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      isSection: new FormControl(null),
    });
    this.selectedPage = null;
  }

  addPage() {
    const page = this.pageForm.value as PageDto;
    this.store.dispatch(new AddPage(page)).subscribe(() => this.updateList());
  }

  markAsRemovedPage(id: string) {
    this.store.dispatch(new MarkAsRemovedPage(id)).subscribe(() => this.updateList());
  }

  updatePage() {
    const page = this.pageForm.value;
    this.store.dispatch(new UpdatePage(page)).subscribe(() => this.updateList());
  }

  resetForm() {
    //this.pageForm.getRawValue();
    this.selectedPage = null;
  }

  onSelect(id: string) {
    const filter: PageFilter = { id };
    this.store.dispatch(new GetPage(filter)).subscribe(() => {
      const page = this.store.selectSnapshot<PageDto>(PageState.page);
      const { id, title, name, isSection } = page;
      this.selectedPage = page as Page;
      this.pageForm.setValue({ id, name, title, isSection });
    });
  }

  onEditorOpen() {
    this.editor.open(this.selectedPage.id);
  }

  onEditorClose(result: string) {
    console.log(result);
  }

  onLinkEditorOpen() {
    this.linkEditor.open(this.selectedPage.id);
  }

  private updateList() {
    this.store.dispatch(new FetchPageList({})).subscribe(() => {
      const pageList: Array<Page> = this.store.selectSnapshot<Array<Page>>(PageState.pageList);
      const items = pageList && pageList.map<Table.Item>(item => ({ id: item.id, values: [item.name, item.title] }));
      this.tableData = {
        fields: ['Имя', 'Название'],
        items,
      };
      this.resetForm();
    });
  }
}
