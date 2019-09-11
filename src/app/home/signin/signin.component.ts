import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformDetectorService } from 'src/app/core/platform-detector/platform-detector.service';

@Component({
    templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit{
    
    fromUrl: string;
    loginForm: FormGroup;
    @ViewChild('userNameInput', { static: true }) userNameInput: ElementRef<HTMLInputElement>;
    
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private platformDetectorService: PlatformDetectorService,
        private activatedRoute: ActivatedRoute) { }
    
    ngOnInit(): void {
        this.activatedRoute
            .queryParams
            .subscribe(params => this.fromUrl = params['fromUrl']);
        this.loginForm = this.formBuilder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.platformDetectorService.isPlatformBrowser() &&
        this.userNameInput.nativeElement.focus();
        // adicionei ela aqui no final...
        this.authService.unknow().subscribe(console.log);
    }

    login() {
        const userName = this.loginForm.get('userName').value;
        const password = this.loginForm.get('password').value;
        this.authService
            .authenticate(userName, password)
            .subscribe(
                () => 
                    this.fromUrl 
                        ? this.router.navigateByUrl(this.fromUrl)
                        : this.router.navigate(['main'])
                    ,
                err => {
                    this.loginForm.reset();
                    this.platformDetectorService.isPlatformBrowser() &&
                        this.userNameInput.nativeElement.focus();
                    alert('Usuário e senha inválido!');
                }
            );
    }
}