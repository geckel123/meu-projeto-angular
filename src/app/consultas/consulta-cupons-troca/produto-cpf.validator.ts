import { ValidatorFn, FormGroup } from "@angular/forms";

export const ProdutoCpfValidator: ValidatorFn = (formGroup: FormGroup) => {
    const produto = formGroup.get('produtoInput').value;
    const cpf = formGroup.get('cpfCnpjClienteInput').value;
    if(produto.trim() || cpf.trim()){
        return null;
    } else {
        return {produtoCpf: true};
    }
}