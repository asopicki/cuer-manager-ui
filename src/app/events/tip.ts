import { Program } from "./program";
import { Cuecard } from "./cuecard";

export class Tip {
    uuid: String;
    name: String;
    program_uuid: String;
    date_start: Date;
    date_end: Date;
    cuecards: Array<Object|Cuecard>

    constructor(data: any, program: Program) {
        Object.assign(this, data);
        this.program_uuid = program.uuid;
        this.date_start = new Date(this.date_start);
        this.date_end = new Date(this.date_end);

        for (let i in this.cuecards) {
            this.cuecards[i] = new Cuecard(this.cuecards[i]);
        }
    }
}
