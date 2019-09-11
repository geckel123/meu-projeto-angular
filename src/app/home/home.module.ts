import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { VmessageModule } from '../shared/components/vmessage/vmessage.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing.module';


@NgModule({
    declarations: [ 
        SigninComponent,
        HomeComponent
    ],
    imports: [ 
        ReactiveFormsModule,
        CommonModule,
        VmessageModule,
        RouterModule,
        FormsModule,
        HomeRoutingModule,
        
    ]
})
export class HomeModule {

}