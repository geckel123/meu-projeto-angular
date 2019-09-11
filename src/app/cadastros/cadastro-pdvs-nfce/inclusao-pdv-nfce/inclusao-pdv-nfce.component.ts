import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AlertService } from "src/app/shared/components/alert/alert.service";
import { CodigoPdvJaExisteValidatorService } from "../codigo-pdv-nfce-ja-existe.validator.service";
import { EhEstabelecimentoValidator } from "src/app/shared/validators/eh-estabelecimento.validator";
import { NewPdvNfce } from "../new-pdv-nfce";
import { CadastroPdvsNfceService } from "../cadastro-pdvs-nfce.service";
import { Estabelecimento } from "../../cadastro-estabelecimentos/cadastro-estabelecimentos";
import { Observable, Subscriber } from "rxjs";
import { ResponseData } from "src/app/shared/interfaces/response-data";
import { ListData } from "src/app/shared/interfaces/list-data";
import { debounceTime, switchMap } from "rxjs/operators";
import { AutoCompleteLojaService } from "src/app/shared/components/autocomplete/loja/auto-complete-loja.service";
import { UserService } from "src/app/core/user/user.service";
import { PdvNfce } from "../cadastro-pdvs-nfce";
import { CadastroEstabelecimentosService } from "../../cadastro-estabelecimentos/cadastro-estabelecimentos.service";

@Component({
    templateUrl: "./inclusao-pdv-nfce.component.html",
    providers: [ CodigoPdvJaExisteValidatorService ]
})
export class InclusaoPdvNfceComponent implements OnInit {
    
    pdvNfce$:Observable<ResponseData<PdvNfce>>;
    
    pdvNfceForm: FormGroup;

    filteredEstabelecimentos: Observable<ResponseData<ListData<Estabelecimento>>>;

    constructor(private fb: FormBuilder,
        private pdvJAExisteValidatorService: CodigoPdvJaExisteValidatorService,
        private cadPdvNfceService: CadastroPdvsNfceService,
        private cadEstabService: CadastroEstabelecimentosService,
        private autoCompleteEstabService: AutoCompleteLojaService,
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private userService: UserService) {}
    

    ngOnInit(): void {
        this.pdvNfceForm = this.fb.group({
            COD_ESTAB: ['', 
                [
                Validators.required,
                EhEstabelecimentoValidator
                ]
            ],
            NRO_PDV: ['',
                [
                Validators.required,
                Validators.pattern(/^[\d]*$/) //Aceita somente números
                ]
            ],
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
        this.pdvNfceForm.get('NRO_PDV').setAsyncValidators(this.pdvJAExisteValidatorService.checkPdvNfceJaExiste(this.pdvNfceForm.get('COD_ESTAB')));

        this.userService.getUser().subscribe(
            user => {
                this.pdvNfceForm.get('MLA_ULT_MANUT').setValue(user.sub);
            }
        )

        this.filteredEstabelecimentos = this.pdvNfceForm.get('COD_ESTAB').valueChanges
                .pipe(
                  debounceTime(300),
                  switchMap(value => this.autoCompleteEstabService.search(this.pdvNfceForm.get('COD_ESTAB').value))
                );

        this.pdvNfce$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
                if(params.get('estab') && params.get('pdv'))
                    return this.cadPdvNfceService.get(params.get('estab'), params.get('pdv'));
                else
                    return new Observable<ResponseData<PdvNfce>>((subscriber) => {
                        var estabelecimento = new Estabelecimento("","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","");
                        var pdv:PdvNfce = new PdvNfce("","","","","","","","","","","","","","","","");
                        subscriber.next(new ResponseData<PdvNfce>("SUCESSO",pdv));
                    });
            })
            );
        this.loadData();
    }

    loadData(): void {
        this.pdvNfce$.subscribe(
            pdvNfce => {
                if(pdvNfce.dados.COD_ESTAB !== "") {
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
                    this.cadEstabService.get(pdvNfce.dados.COD_ESTAB).subscribe(estabelecimento => {
                        this.pdvNfceForm.get('COD_ESTAB').setValue(estabelecimento.dados);
                    })
                }
            }
        )
        
    }

    displayEstab(estab: Estabelecimento) {
        if (typeof estab.COD_ESTABELECIMENT !== "undefined") { 
            return estab.COD_ESTABELECIMENT + " - " + estab.DES_ESTABELECIMENT.trim()
        }
    }

    voltar() {
        this.router.navigate(['cadastros/cadastro-pdvs-nfce']);
    }

    incluir() {
        if(this.pdvNfceForm.valid && !this.pdvNfceForm.pending) {
            const newPdvNfce = this.pdvNfceForm.getRawValue() as NewPdvNfce;
            this.cadPdvNfceService
                .incluir(newPdvNfce)
                .subscribe(
                    () => {
                        this.router.navigate(['cadastros/cadastro-pdvs-nfce']);
                        this.alertService.success("PDV NFCE incluido com sucesso.",10000, false);
                    },
                    err => {
                        console.log(err);
                        this.router.navigate(['cadastros/cadastro-pdvs-nfce']);
                        this.alertService.danger("ERRO! Nao foi possivel incluir o PDV NFCE.",10000, false);
                    }
                );
        }
    }

    
}