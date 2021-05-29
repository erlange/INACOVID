import { RouterModule } from '@angular/router';
import { NbSidebarModule, NbLayoutModule, NbButtonModule, NbSidebarService, NbCardModule, NbSelectModule, NbActionsModule, } from '@nebular/theme';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    RouterModule,
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbCardModule,
    NbSelectModule,
    NbActionsModule,
  ],
  exports: [
    RouterModule,
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbCardModule,
    NbSelectModule,
    NbActionsModule,
  ],
  providers: [NbSidebarService]
})
export class UiModule { }
