import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncObserveDirective, AsyncObserveValueDirective, AsyncObserveErrorDirective, AsyncObserveStartupDirective, AsyncObserveCompleteDirective } from './async-observe.directive';

@NgModule({
  declarations: [
    AsyncObserveDirective,
    AsyncObserveValueDirective,
    AsyncObserveStartupDirective,
    AsyncObserveStartupDirective,
    AsyncObserveErrorDirective,
    AsyncObserveCompleteDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    AsyncObserveDirective,
    AsyncObserveValueDirective,
    AsyncObserveStartupDirective,
    AsyncObserveErrorDirective,
    AsyncObserveCompleteDirective,
  ],
})
export class AsyncRenderModule { }
