import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentModule } from './components/component.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { ApiInterceptor } from './services/api.interceptor';
import { environment } from '@env/environment';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PersonState, CemeteryState, PageState } from '@states';
import { SharedModule } from '@shared';
import { NotifierModule } from 'angular-notifier';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LinkState } from './states/link.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'genealogy' }),
    ComponentModule,
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([PersonState, CemeteryState, PageState, LinkState], {
      developmentMode: !environment.production,
    }),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    SharedModule,
    NotifierModule,
    NgbModule,
    AngularEditorModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
  ],
  exports: [],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    NgbModal,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
