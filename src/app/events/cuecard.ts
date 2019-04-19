export class Cuecard {
    id: number;
	uuid: String;
	phase: String;
	rhythm: String;
	title: String;
	steplevel: String;
	difficulty: String;
	choreographer: String;
	meta: Object;
	content: String;

    constructor(data: any) {
        Object.assign(this, data);
        this.meta = JSON.parse(data.meta);
    }
}
