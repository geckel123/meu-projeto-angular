import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { RequiresAuthenticationGuard } from 'src/app/core/auth/requires-authentication.guard';
import { CadastroPdvsNfceComponent } from './cadastro-pdvs-nfce.component';
import { InclusaoPdvNfceComponent } from './inclusao-pdv-nfce/inclusao-pdv-nfce.component';
import { AlteracaoPdvNfceComponent } from './alteracao-pdv-nfce/alteracao-pdv-nfce.component';
import { VisualizacaoPdvNfceComponent } from './visualizacao-pdv-nfce/visualizacao-pdv-nfce.component';
import { DelecaoPdvNfceComponent } from './delecao-pdv-nfce/delecao-pdv-nfce.component';


const routes: Routes = [
    {
        path: '', 
        component: CadastroPdvsNfceComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de PDVs NFCE'
        }
    },
    {
        path: 'inclusao', 
        component: InclusaoPdvNfceComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de PDVs NFCE (inclusão)'
        } 
    },
    {
        path: 'alteracao/:estab/:pdv', 
        component: AlteracaoPdvNfceComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de PDVs NFCE (alteração)'
        } 
    },
    {
        path: 'visualizacao/:estab/:pdv', 
        component: VisualizacaoPdvNfceComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de PDVs NFCE (visualização)'
        } 
    },
    {
        path: 'delecao/:estab/:pdv', 
        component: DelecaoPdvNfceComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de PDVs NFCE (deleção)'
        } 
    }
]

@NgModule({
    imports: [ 
        RouterModule.forChild(routes) 
    ],
    exports: [ RouterModule ]
})
export class CadastroPdvsNfceRoutingModule {

}