import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NbSidebarModule, NbLayoutModule, NbButtonModule,
          NbSidebarService, NbCardModule, NbSelectModule,
          NbRadioModule, NbActionsModule, } from '@nebular/theme';


@NgModule({
  imports: [
    RouterModule,
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbCardModule,
    NbSelectModule,
    NbRadioModule,
    NbActionsModule,
  ],
  exports: [
    RouterModule,
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbCardModule,
    NbSelectModule,
    NbRadioModule,
    NbActionsModule,
  ],
  providers: [NbSidebarService]
})
export class UiModule { }
