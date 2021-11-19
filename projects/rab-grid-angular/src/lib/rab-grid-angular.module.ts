import { NgModule } from '@angular/core';
import { RabGridAngularComponent } from './rab-grid-angular.component';
import { FormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [
    RabGridAngularComponent
  ],
  imports: [
    FormsModule,
    FontAwesomeModule
  ],
  exports: [
    RabGridAngularComponent
  ]
})
export class RabGridAngularModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab)
  }
}
