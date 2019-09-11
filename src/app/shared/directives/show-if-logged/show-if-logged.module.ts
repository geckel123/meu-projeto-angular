import { NgModule } from "@angular/core";
import { showIfLoggedDirective } from "./show-if-logged.directive";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [showIfLoggedDirective],
    exports: [showIfLoggedDirective],
    imports: [CommonModule]
})
export class ShowIfLoggedModule {}