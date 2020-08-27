class Favorite{
    constructor(id_userf, id_episode){
        this.id_userf=id_userf;
        this.id_episode=id_episode;
    }

    static from(json) {
        const t = Object.assign(new Favorite(), json);
        return t;
    }
}
export default Favorite;