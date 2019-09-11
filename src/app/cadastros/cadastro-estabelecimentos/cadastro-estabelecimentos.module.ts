import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VmessageModule } from 'src/app/shared/components/vmessage/vmessage.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { AutoCompleteLojaService } from 'src/app/shared/components/autocomplete/loja/auto-complete-loja.service';

import { CadastroEstabelecimentosComponent } from './cadastro-estabelecimentos.component';
import { CadastroEstabelecimentosRoutingModule } from './cadastro-estabelecimentos.routing.module';
import { MatPaginatorIntlPt } from 'src/app/shared/intl/mat-paginator-intl-pt';
import { InclusaoEstabelecimentoComponent } from './inclusao-estabelecimento/inclusao-estabelecimento.component';
import { AlteracaoEstabelecimentoComponent } from './alteracao-estabelecimento/alteracao-estabelecimento.component';
import { DelecaoEstabelecimentoComponent } from './delecao-estabelecimento/delecao-estabelecimento.component';
import { VisualizacaoEstabelecimentoComponent } from './visualizacao-estabelecimento/visualizacao-estabelecimento.component';
import { AutoCompleteCidadeService } from 'src/app/shared/components/autocomplete/cidade/auto-complete-cidade.service';


@NgModule({
    declarations: [
        CadastroEstabelecimentosComponent,
        InclusaoEstabelecimentoComponent,
        AlteracaoEstabelecimentoComponent,
        DelecaoEstabelecimentoComponent,
        VisualizacaoEstabelecimentoComponent
    ],
    exports: [
        CadastroEstabelecimentosComponent
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
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        CadastroEstabelecimentosRoutingModule
    ],
    providers: [
        AutoCompleteLojaService,
        AutoCompleteCidadeService,
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPt}
    ]
})
export class CadastroEstabelecimentosModule {}