import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { RequiresAuthenticationGuard } from 'src/app/core/auth/requires-authentication.guard';
import { RelatorioDesempVendasComponent } from './relatorio-desemp-vendas.component';



const routes: Routes = [
    {
        path: '', 
        component: RelatorioDesempVendasComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Relatório Desempenho Vendedor'
        }
    }
]

@NgModule({
    imports: [ 
        RouterModule.forChild(routes) 
    ],
    exports: [ RouterModule ]
})
export class RelatorioDesempVendasRoutingModule {

}