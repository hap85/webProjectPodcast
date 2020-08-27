
class User{
    constructor(id, username, email, password, creator){
        this.id=id;
        this.username=username;
        this.email=email;
        this.password=password;
        this.creator=creator;
    }

    static from(json) {
        const t = Object.assign(new User(), json);
        return t;
    }
}
export default User;