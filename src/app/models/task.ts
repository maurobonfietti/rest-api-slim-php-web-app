export class Task {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public status: number,
        public createdAt,
        public updatedAt
    ) {

    }
}
