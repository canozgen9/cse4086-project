export default class Modifier {
    baseName = '@/';

    constructor(name) {
        this.baseName = `@${name}/`;
    }

    name(name) {
        return `${this.baseName}${name}`;
    }
}
