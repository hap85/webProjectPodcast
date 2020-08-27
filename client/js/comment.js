class Comment{
    constructor(id_comment,id_episode, id_serie, text, name_user){
        if(id_comment)
            this.id_comment = id_comment;
        this.id_episode=id_episode;
        this.id_serie = id_serie;
        this.text=text;
        this.name_user=name_user;
    }
    static from(json) {
        const t = Object.assign(new Comment(), json);
        return t;
    }
} 

export default Comment;