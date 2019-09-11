import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { RequiresAuthenticationGuard } from 'src/app/core/auth/requires-authentication.guard';
import { CadastroEstabelecimentosComponent } from './cadastro-estabelecimentos.component';
import { InclusaoEstabelecimentoComponent } from './inclusao-estabelecimento/inclusao-estabelecimento.component';
import { AlteracaoEstabelecimentoComponent } from './alteracao-estabelecimento/alteracao-estabelecimento.component';
import { DelecaoEstabelecimentoComponent } from './delecao-estabelecimento/delecao-estabelecimento.component';
import { VisualizacaoEstabelecimentoComponent } from './visualizacao-estabelecimento/visualizacao-estabelecimento.component';


const routes: Routes = [
    {
        path: '', 
        component: CadastroEstabelecimentosComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de Estabelecimentos'
        }
    },
    {
        path: 'inclusao', 
        component: InclusaoEstabelecimentoComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de Estabelecimentos (inclusão)'
        } 
    },
    {
        path: 'alteracao/:id', 
        component: AlteracaoEstabelecimentoComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de Estabelecimentos (alteração)'
        } 
    },
    {
        path: 'visualizacao/:id', 
        component: VisualizacaoEstabelecimentoComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de Estabelecimentos (visualização)'
        } 
    },
    {
        path: 'delecao/:id', 
        component: DelecaoEstabelecimentoComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de Estabelecimentos (deleção)'
        } 
    }
]

@NgModule({
    imports: [ 
        RouterModule.forChild(routes) 
    ],
    exports: [ RouterModule ]
})
export class CadastroEstabelecimentosRoutingModule {

}