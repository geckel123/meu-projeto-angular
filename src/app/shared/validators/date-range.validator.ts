import { ValidatorFn, FormGroup } from "@angular/forms";

export const dateRangeValidatorFactory  = (days: number): ValidatorFn => {
    return (formGroup: FormGroup) => {
        const dataIni = new Date(formGroup.get('dataIniInput').value);
        const dataFim = new Date(formGroup.get('dataFimInput').value);
        var timeDiff = dataFim.getTime() - dataIni.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        
        if(diffDays > days ) {
            return {dateRange: true};
        }

        if(diffDays<0) {
            return {dateRangeInvalid: true};
        }
        return null;
    }
}