import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { RequiresAuthenticationGuard } from 'src/app/core/auth/requires-authentication.guard';
import { ConsultaCuponsTrocaComponent } from './consulta-cupons-troca.component';


const routes: Routes = [
    {
        path: '', 
        component: ConsultaCuponsTrocaComponent,
        canActivate: [RequiresAuthenticationGuard],
        data: {
            title: 'Consulta Cupons para Troca'
        }
    }
]

@NgModule({
    imports: [ 
        RouterModule.forChild(routes) 
    ],
    exports: [ RouterModule ]
})
export class ConsultaCuponsTrocaRoutingModule {

}