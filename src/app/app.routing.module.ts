import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { NotFoundComponent } from './errors/not-found/not-found.component';
import { RequiresAuthenticationGuard } from './core/auth/requires-authentication.guard';
import { GlobalErrorComponent } from './errors/global-error/global-error.component';
import { MainComponent } from './core/main/main.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home', 
        loadChildren: './home/home.module#HomeModule'
    },
    {
        path:'relatorios/relatorio-desemp-vendas',
        pathMatch: 'full',
        loadChildren: './relatorios/relatorio-desemp-vendas/relatorio-desemp-vendas.module#RelatorioDesempVendasModule'
    },
    {
        path:'consultas/consulta-resultado-loja',
        pathMatch: 'full',
        loadChildren: './consultas/consulta-resultado-loja/consulta-resultado-loja.module#ConsultaResultadoLojaModule'
    },
    {
        path:'consultas/consulta-cupons-troca',
        pathMatch: 'full',
        loadChildren: './consultas/consulta-cupons-troca/consulta-cupons-troca.module#ConsultaCuponsTrocaModule'
    },
    {
        path:'cadastros/cadastro-estabelecimentos',
        pathMatch: 'prefix',
        loadChildren: './cadastros/cadastro-estabelecimentos/cadastro-estabelecimentos.module#CadastroEstabelecimentosModule'
    },
    {
        path:'cadastros/cadastro-shoppings',
        pathMatch: 'prefix',
        loadChildren: './cadastros/cadastro-shoppings/cadastro-shoppings.module#CadastroShoppingsModule'
    },
    {
        path:'cadastros/cadastro-pdvs-nfce',
        pathMatch: 'prefix',
        loadChildren: './cadastros/cadastro-pdvs-nfce/cadastro-pdvs-nfce.module#CadastroPdvsNfceModule'
    },
    {
        path: 'main', 
        component: MainComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Principal'
        }
        
    },
    {
        path: 'error', 
        component: GlobalErrorComponent,
        data: {
            title: 'Error'
        }
    },
    {
        path: 'not-found', 
        component: NotFoundComponent,
        data: {
            title: 'Not found'
        }
    },
    {
        path: '**', 
        redirectTo: 'not-found'
    }
]

@NgModule({
    imports: [ 
        RouterModule.forRoot(routes, {enableTracing: false, useHash: true }) 
    ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {

}