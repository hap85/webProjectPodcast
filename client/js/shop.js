class Shop{
    constructor(id_user, id_episode){
        this.id_user = id_user;
        this.id_episode=id_episode;
    }
    static from(json) {
        const t = Object.assign(new Shop(), json);
        return t;
    }
} 

export default Shop;