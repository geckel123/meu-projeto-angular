import { Component, Input } from "@angular/core";
import { AlertService } from "./alert.service";
import { Alert, AlertType } from "./alert";
import * as $ from "jquery";

@Component({
    selector: 'ap-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent {

    alerts: Alert[] = [];

    limpaSetTimeout;
    limpaSetTimeout1;

    constructor(private alertService: AlertService) {
        this.alertService
            .getAlert()
            .subscribe(alert => {
                if(!alert) {
                    this.alerts = [];
                    clearTimeout(this.limpaSetTimeout);
                    clearTimeout(this.limpaSetTimeout1);
                    return;
                }
                this.alerts.push(alert);
                this.limpaSetTimeout  = setTimeout(() => this.fadeOut(), alert.timeout-500);
                this.limpaSetTimeout1 = setTimeout(() => this.removeAlert(alert), alert.timeout);
            })
    }

    fadeOut(){
        $("#alertOverlay").fadeOut(500);
    }

    fechar(alert: Alert) {
        $("#alertOverlay").fadeOut(500);
        setTimeout(() => this.removeAlert(alert), 500);
    }

    removeAlert(alertToRemove: Alert) {
        clearTimeout(this.limpaSetTimeout);
        clearTimeout(this.limpaSetTimeout1);
        this.alerts = this.alerts.filter(alert => alert != alertToRemove);
    }

    getAlertClass(alert: Alert) {
        if(!alert) return '';

        switch (alert.alertType) {
            case AlertType.DANGER:
                return 'alert alert-danger';
            case AlertType.INFO:
                return 'alert alert-info';
            case AlertType.SUCCESS:
                return 'alert alert-success';
            case AlertType.WARNING:
                return 'alert alert-warning';
        }
    }
}