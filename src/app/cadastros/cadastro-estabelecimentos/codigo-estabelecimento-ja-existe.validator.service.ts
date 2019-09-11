import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { debounceTime, switchMap, map, first, startWith } from 'rxjs/operators';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { CadastroEstabelecimentosService } from './cadastro-estabelecimentos.service';

@Injectable()
export class CodigoEstabelecimentoJaExisteValidatorService {
    constructor(private estabelecimentoService: CadastroEstabelecimentosService) {}

    checkEstabelecimentoJaExiste() {
        return (control: AbstractControl) => {
            return control
                .valueChanges
                .pipe(startWith(''),debounceTime(300))
                .pipe(switchMap(codEstabelecimento => 
                        this.estabelecimentoService.estabelecimentoJaExiste(codEstabelecimento)
                ))
                .pipe(map((jaExiste:ResponseData<Boolean>) => jaExiste.dados ? {estabelecimentoJaExiste: true} : null))
                .pipe(first());

        }
    }
}