export class Alert{
    constructor(
        public readonly alertType: AlertType,
        public readonly message: string,
        public readonly timeout: number
    ) {}

}

export enum AlertType{

    SUCCESS,
    WARNING,
    DANGER,
    INFO
}