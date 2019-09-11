import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from '../core/auth/auth.guard';
import { HomeComponent } from './home.component';
import { SigninComponent } from './signin/signin.component';



const routes: Routes = [
   {
        path: '', 
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '', 
                component: SigninComponent,
                canActivate: [AuthGuard],
                data: {
                    title: 'Login'
                }
            }
        ]
    }
]

@NgModule({
    imports: [ 
        RouterModule.forChild(routes) 
    ],
    exports: [ RouterModule ]
})
export class HomeRoutingModule {

}