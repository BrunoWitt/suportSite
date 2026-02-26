class Ticket{
    constructor(id, title, description, status, prioridade, client_id, agente_id){
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.prioridade = prioridade;
        this.client_id = client_id;
        this.agente_id = agente_id;
    }
}

module.exports = Ticket;