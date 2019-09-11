import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VmessageModule } from 'src/app/shared/components/vmessage/vmessage.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutoCompleteLojaService } from 'src/app/shared/components/autocomplete/loja/auto-complete-loja.service';
import { RelatorioDesempVendasComponent } from './relatorio-desemp-vendas.component';
import { RelatorioDesempVendasRoutingModule } from './relatorio-desemp-vendas.routing.module';


@NgModule({
    declarations: [RelatorioDesempVendasComponent],
    exports: [RelatorioDesempVendasComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        VmessageModule,
        MatInputModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatButtonModule,
        RelatorioDesempVendasRoutingModule,
        MatExpansionModule
    ],
    providers: [
        AutoCompleteLojaService
    ]
})
export class RelatorioDesempVendasModule {}