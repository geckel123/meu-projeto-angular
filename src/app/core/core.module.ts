import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './auth/request.interceptor';
import { FooterComponent } from './footer/footer.component';
import { AlertModule } from '../shared/components/alert/alert.module';
import { LoadingModule } from '../shared/components/loading/loading.module';
import { MenuModule } from '../shared/components/menu/menu.module';
import { ShowIfLoggedModule } from '../shared/directives/show-if-logged/show-if-logged.module';
import { MainComponent } from './main/main.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        MainComponent
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        MainComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        AlertModule,
        LoadingModule,
        MenuModule,
        MatTreeModule,
        MatIconModule,
        ShowIfLoggedModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptor,
            multi: true
        }
    ]
})
export class CoreModule {}