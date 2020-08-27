class Serie{
    constructor(id_serie, id_user, title, description, image, categorie, author){
        if(id_serie)
            this.id_serie=id_serie;
        this.id_user=id_user;
        this.title=title;
        this.description=description;
        this.image=image;
        this.categorie=categorie;
        this.author=author;
    }

    static from(json) {
        const t = Object.assign(new Serie(), json);
        return t;
    }
}
//module.exports = Serie;
export default Serie;
