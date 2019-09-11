export class ResponseData<T> {
    constructor(public consequence: string,
    public dados: T
    ) {}
}