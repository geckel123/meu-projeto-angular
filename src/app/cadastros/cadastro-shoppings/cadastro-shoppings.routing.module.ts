import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { RequiresAuthenticationGuard } from 'src/app/core/auth/requires-authentication.guard';
import { CadastroShoppingsComponent } from './cadastro-shoppings.component';
import { InclusaoShoppingComponent } from './inclusao-shopping/inclusao-shopping.component';
import { AlteracaoShoppingComponent } from './alteracao-shopping/alteracao-shopping.component';
import { DelecaoShoppingComponent } from './delecao-shopping/delecao-shopping.component';
import { VisualizacaoShoppingComponent } from './visualizacao-shopping/visualizacao-shopping.component';


const routes: Routes = [
    {
        path: '', 
        component: CadastroShoppingsComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de Shoppings'
        }
    },
    {
        path: 'inclusao', 
        component: InclusaoShoppingComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de Shoppings (inclusão)'
        } 
    },
    {
        path: 'alteracao/:id', 
        component: AlteracaoShoppingComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de Shoppings (alteração)'
        } 
    },
    {
        path: 'visualizacao/:id', 
        component: VisualizacaoShoppingComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de Shoppings (visualização)'
        } 
    },
    {
        path: 'delecao/:id', 
        component: DelecaoShoppingComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Cadastro de Shoppings (deleção)'
        } 
    }
]

@NgModule({
    imports: [ 
        RouterModule.forChild(routes) 
    ],
    exports: [ RouterModule ]
})
export class CadastroShoppingsRoutingModule {

}