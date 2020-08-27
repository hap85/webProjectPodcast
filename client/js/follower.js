class Follower{
    constructor(id_follower, id_serie){
        this.id_follower=id_follower;
        this.id_serie=id_serie;
    }

    static from(json) {
        const t = Object.assign(new Follower(), json);
        return t;
    }
}
export default Follower;