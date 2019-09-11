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

import { MatPaginatorIntlPt } from 'src/app/shared/intl/mat-paginator-intl-pt';
import { CadastroPdvsNfceComponent } from './cadastro-pdvs-nfce.component';
import { InclusaoPdvNfceComponent } from './inclusao-pdv-nfce/inclusao-pdv-nfce.component';
import { AlteracaoPdvNfceComponent } from './alteracao-pdv-nfce/alteracao-pdv-nfce.component';
import { DelecaoPdvNfceComponent } from './delecao-pdv-nfce/delecao-pdv-nfce.component';
import { VisualizacaoPdvNfceComponent } from './visualizacao-pdv-nfce/visualizacao-pdv-nfce.component';
import { CadastroPdvsNfceRoutingModule } from './cadastro-pdvs-nfce.routing.module';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
    declarations: [
        CadastroPdvsNfceComponent,
        InclusaoPdvNfceComponent,
        AlteracaoPdvNfceComponent,
        DelecaoPdvNfceComponent,
        VisualizacaoPdvNfceComponent

    ],
    exports: [
        CadastroPdvsNfceComponent
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
        MatIconModule,
        CadastroPdvsNfceRoutingModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPt}
    ]
})
export class CadastroPdvsNfceModule {}