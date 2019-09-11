import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VmessageModule } from 'src/app/shared/components/vmessage/vmessage.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { CadastroShoppingsComponent } from './cadastro-shoppings.component';
import { CadastroShoppingsRoutingModule } from './cadastro-shoppings.routing.module';
import { MatPaginatorIntlPt } from 'src/app/shared/intl/mat-paginator-intl-pt';
import { InclusaoShoppingComponent } from './inclusao-shopping/inclusao-shopping.component';
import { AlteracaoShoppingComponent } from './alteracao-shopping/alteracao-shopping.component';
import { DelecaoShoppingComponent } from './delecao-shopping/delecao-shopping.component';
import { VisualizacaoShoppingComponent } from './visualizacao-shopping/visualizacao-shopping.component';


@NgModule({
    declarations: [
        CadastroShoppingsComponent,
        InclusaoShoppingComponent,
        AlteracaoShoppingComponent,
        DelecaoShoppingComponent,
        VisualizacaoShoppingComponent
    ],
    exports: [
        CadastroShoppingsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        VmessageModule,
        MatInputModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatButtonModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatTabsModule,
        CadastroShoppingsRoutingModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPt}
    ]
})
export class CadastroShoppingsModule {}