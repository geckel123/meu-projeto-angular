import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VmessageComponent } from './vmessage.component';

@NgModule({
    declarations: [ VmessageComponent ],
    exports: [ VmessageComponent ],
    imports: [ CommonModule ]
})
export class VmessageModule {}