import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { ConsultaResultadoLojaComponent } from './consulta-resultado-loja.component';
import { RequiresAuthenticationGuard } from 'src/app/core/auth/requires-authentication.guard';


const routes: Routes = [
    {
        path: '', 
        component: ConsultaResultadoLojaComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Consulta Resultado Loja'
        }
    }
]

@NgModule({
    imports: [ 
        RouterModule.forChild(routes) 
    ],
    exports: [ RouterModule ]
})
export class ConsultaResultadoLojaRoutingModule {

}