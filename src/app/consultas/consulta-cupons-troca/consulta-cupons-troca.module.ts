import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VmessageModule } from 'src/app/shared/components/vmessage/vmessage.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutoCompleteLojaService } from 'src/app/shared/components/autocomplete/loja/auto-complete-loja.service';
import { ConsultaCuponsTrocaComponent } from './consulta-cupons-troca.component';
import { ConsultaCuponsTrocaRoutingModule } from './consulta-cupons-troca.routing.module';
import { AutoCompleteProdutoService } from 'src/app/shared/components/autocomplete/produto/auto-complete-produto.service';


@NgModule({
    declarations: [ConsultaCuponsTrocaComponent],
    exports: [ConsultaCuponsTrocaComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        VmessageModule,
        MatInputModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatButtonModule,
        ConsultaCuponsTrocaRoutingModule
    ],
    providers: [
        AutoCompleteLojaService,
        AutoCompleteProdutoService
    ]
})
export class ConsultaCuponsTrocaModule {}