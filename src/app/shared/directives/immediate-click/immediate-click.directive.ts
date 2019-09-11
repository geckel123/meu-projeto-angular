import { NgModule } from "@angular/core";
import { ImmediateClickDirective } from "./immediate-click.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ImmediateClickDirective],
    exports: [ImmediateClickDirective],
    imports: [CommonModule]
})
export class ImmediateClickModule {

}