import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertService } from "src/app/shared/components/alert/alert.service";
import { ResponseData } from "src/app/shared/interfaces/response-data";
import { CadastroPdvsNfceService } from "../cadastro-pdvs-nfce.service";
import { PdvNfce } from "../cadastro-pdvs-nfce";
import { NewPdvNfce } from "../new-pdv-nfce";
import { CodigoPdvJaExisteValidatorService } from "../codigo-pdv-nfce-ja-existe.validator.service";
import { UserService } from "src/app/core/user/user.service";

@Component({
    templateUrl: "./alteracao-pdv-nfce.component.html",
    providers: [ CodigoPdvJaExisteValidatorService ]
})
export class AlteracaoPdvNfceComponent implements OnInit{
    
    constructor(private fb: FormBuilder,
        private cadPdvNfceService: CadastroPdvsNfceService,
        private router: Router,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private userService: UserService) {}

    pdvNfce$:Observable<ResponseData<PdvNfce>>;
    pdvNfceForm: FormGroup;

    ngOnInit(): void {
        this.pdvNfceForm = this.fb.group({
            COD_ESTAB: '',
            NRO_PDV: '',
            COD_ATIVACAO_SAT: ['',
                [
                Validators.maxLength(30)
                ]
            ],
            COD_MODELO_SAT: ['',
                [
                Validators.pattern(/^[\d]*$/) //Aceita somente números
                ]
            ],
            NOM_USUARIO_NFCE: ['',
                [
                Validators.required,
                Validators.maxLength(40)
                ]
            ],
            DES_SENHA_NFCE: ['',
                [
                Validators.required,
                Validators.maxLength(40)
                ]
            ],
            NRO_ULTIMO_NFCE: ['',
                [
                Validators.required,
                Validators.pattern(/^[\d]*$/) //Aceita somente números
                ]
            ],
            COD_SERIE_NFCE: ['',
                [
                Validators.required,
                Validators.pattern(/^[\d]*$/) //Aceita somente números
                ]
            ],
            DAT_ULT_MANUT: ['',[]],
            MLA_ULT_MANUT: ['',[]],
            IDT_TIPO_AMBIENTE: ['',
                [
                Validators.required,
                Validators.pattern(/^[\d]*$/) //Aceita somente números
                ]
            ],
            COD_SERIE_SAT: ['',
                [
                Validators.maxLength(3)
                ]
            ],
            SERIE_EQUIP_SAT: ['',
                [
                Validators.maxLength(25)
                ]
            ],
            AGENT_SATHOST: ['',
                [
                Validators.maxLength(15)
                ]
            ],
            AGENT_SATPORTA: ['',
                [
                Validators.pattern(/^[\d]*$/) //Aceita somente números
                ]
            ],
            AGENT_TIPO: ['',
                [
                Validators.maxLength(5)
                ]
            ]
        });
        
        this.userService.getUser().subscribe(
            user => {
                this.pdvNfceForm.get('MLA_ULT_MANUT').setValue(user.sub);
            }
        )

        this.pdvNfce$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
               return this.cadPdvNfceService.get(params.get('estab'), params.get('pdv'));
            })
          );
        this.loadData();
    }

    loadData(): void {
        this.pdvNfce$.subscribe(
            pdvNfce => {
                if(pdvNfce.dados.COD_ATIVACAO_SAT!==null)
                    pdvNfce.dados.COD_ATIVACAO_SAT = pdvNfce.dados.COD_ATIVACAO_SAT.trim();
                if(pdvNfce.dados.NOM_USUARIO_NFCE!==null)
                    pdvNfce.dados.NOM_USUARIO_NFCE = pdvNfce.dados.NOM_USUARIO_NFCE.trim();
                if(pdvNfce.dados.DES_SENHA_NFCE!==null)
                    pdvNfce.dados.DES_SENHA_NFCE = pdvNfce.dados.DES_SENHA_NFCE.trim();
                if(pdvNfce.dados.SERIE_EQUIP_SAT!==null)
                    pdvNfce.dados.SERIE_EQUIP_SAT = pdvNfce.dados.SERIE_EQUIP_SAT.trim();
                if(pdvNfce.dados.COD_SERIE_SAT!==null)
                    pdvNfce.dados.COD_SERIE_SAT = pdvNfce.dados.COD_SERIE_SAT.trim();
                if(pdvNfce.dados.AGENT_SATHOST!==null)
                    pdvNfce.dados.AGENT_SATHOST = pdvNfce.dados.AGENT_SATHOST.trim();
                if(pdvNfce.dados.AGENT_TIPO!==null)
                    pdvNfce.dados.AGENT_TIPO = pdvNfce.dados.AGENT_TIPO.trim();
                
                this.pdvNfceForm.setValue(pdvNfce.dados);
            }
        )
    }

    voltar() {
        this.router.navigate(['cadastros/cadastro-pdvs-nfce']);
    }


    alterar() {
        if(this.pdvNfceForm.valid && !this.pdvNfceForm.pending) {
            const pdvNfce = this.pdvNfceForm.getRawValue() as NewPdvNfce;
            this.cadPdvNfceService
                .alterar(pdvNfce)
                .subscribe(
                    () => {
                        this.router.navigate(['cadastros/cadastro-pdvs-nfce']);
                        this.alertService.success("PDV NFCE alterado com sucesso.",10000, false);
                    },
                    err => {
                        console.log(err);
                        this.router.navigate(['cadastros/cadastro-pdvs-nfce']);
                        this.alertService.danger("ERRO! Nao foi possivel alterar o PDV NFCE.");
                    }
                );
        }
    }

    
}