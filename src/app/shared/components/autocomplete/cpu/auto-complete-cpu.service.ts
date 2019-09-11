import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { CadastroCpusService } from 'src/app/cadastros/cadastro-cpus/cadastro-cpus.service';
import { Cpu } from 'src/app/cadastros/cadastro-cpus/cadastro-cpus';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class AutoCompleteCpuService {
    constructor(private cadCpuService: CadastroCpusService) { }

    search(filter: any = ''): Observable<ResponseData<ListData<Cpu>>> {
        if(filter instanceof Cpu){
            filter = filter.COD_CPU;
        }
        if(filter) {
            return this.cadCpuService.list(filter,0,50)
            .pipe(
                tap((response: ResponseData<ListData<Cpu>>) => {
                    response.dados.listaRegistros = response.dados.listaRegistros
                        .map(cpu => new Cpu(cpu.COD_CPU,
                                            cpu.NRO_TELEFONE,
                                            cpu.IDC_CPU_LOCAL,
                                            cpu.NOME_CPU,
                                            cpu.DAT_ULTIMA_TRANS,
                                            cpu.IDT_TIPO_TRANS,
                                            cpu.NOM_DISP_GRAVACAO,
                                            cpu.IDC_PROCESSA_RET,
                                            cpu.QTD_VENDAS_SEG,
                                            cpu.IDT_MODELO1,
                                            cpu.IDT_USO_RESTRITIVO,
                                            cpu.IDT_TREINAMENTO,
                                            cpu.IDT_COMP_ECF_CPU,
                                            cpu.IDT_GERA_REM_UNICA,
                                            cpu.IDT_EXIGE_CLI_NF));
                    return response;
                })
            );
        } else {
            return new Observable<ResponseData<ListData<Cpu>>>();
        }
    }
}