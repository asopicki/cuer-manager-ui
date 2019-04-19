import {Event} from './event';

export class Program {
    id: number;
    uuid: String;
    notes: String;
    event: Event;

    constructor(data: any, event: Event) {
        Object.assign(this, data);
        this.event = event;
    }
}

export type OptionalProgram = Program | null;
