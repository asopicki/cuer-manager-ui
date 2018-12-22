export class Event {
    id: number;
    uuid: String;
    date_start: Date;
    date_end: Date;
    name: String;

    constructor(data: any) {
        Object.assign(this, data);
        this.date_start = new Date(this.date_start);
        this.date_end = new Date(this.date_end);
    }
}
