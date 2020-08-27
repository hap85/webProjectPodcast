class Episode{
    constructor(id_episode, id_serie, id_partner, audio, description, date, price){
        if(id_episode)
            this.id_episode=id_episode;
            
        this.id_serie=id_serie;
        this.id_partner=id_partner;
        this.audio=audio;
        this.description=description;
        this.date=date;
        this.price=price;
    }
    static from(json) {
        const t = Object.assign(new Episode(), json);
        return t;
    }
} 
//module.exports = Episode;
export default Episode;