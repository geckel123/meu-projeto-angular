import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Alert, AlertType } from "./alert";
import { Router, NavigationStart } from "@angular/router";

@Injectable({providedIn: 'root'})
export class AlertService {

    alertSubject: Subject<Alert> = new Subject<Alert>();
    keepAfterRouteChange = false;

    constructor(router: Router) {
        router.events.subscribe(event => {
            if(event instanceof NavigationStart) {
                if(this.keepAfterRouteChange) {
                    this.keepAfterRouteChange = false;
                } else {
                    this.clear();
                }
            }
        })
    }

    success(message: string, timeout: number = 10000, keepAfterRouteChange: boolean = false) {
        this.alert(AlertType.SUCCESS, message, timeout, keepAfterRouteChange);
    }

    warning(message: string, timeout: number = 10000, keepAfterRouteChange: boolean = false) {
        this.alert(AlertType.WARNING, message, timeout, keepAfterRouteChange);
    }

    danger(message: string, timeout: number = 10000, keepAfterRouteChange: boolean = false) {
        this.alert(AlertType.DANGER, message, timeout, keepAfterRouteChange);
    }

    info(message: string, timeout: number = 10000, keepAfterRouteChange: boolean = false) {
        this.alert(AlertType.INFO, message, timeout, keepAfterRouteChange);
    }

    private alert(alertType: AlertType, message: string, timeout: number, keepAfterRouteChange: boolean) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.alertSubject.next(new Alert(alertType, message, timeout));
    }

    getAlert() {
        return this.alertSubject.asObservable();
    }

    clear() {
        this.alertSubject.next(null);
    }
}