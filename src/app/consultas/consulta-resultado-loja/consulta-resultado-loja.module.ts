import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaResultadoLojaComponent } from './consulta-resultado-loja.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VmessageModule } from 'src/app/shared/components/vmessage/vmessage.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutoCompleteLojaService } from 'src/app/shared/components/autocomplete/loja/auto-complete-loja.service';
import { ConsultaResultadoLojaRoutingModule } from './consulta-resultado-loja.routing.module';

@NgModule({
    declarations: [ConsultaResultadoLojaComponent],
    exports: [ConsultaResultadoLojaComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        VmessageModule,
        MatInputModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatButtonModule,
        ConsultaResultadoLojaRoutingModule
    ],
    providers: [AutoCompleteLojaService]
})
export class ConsultaResultadoLojaModule {}