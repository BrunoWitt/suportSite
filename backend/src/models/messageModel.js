class Message {
    constructor(id, sender_id, ticket_id, content, is_read, created_at) {
        this.id = id;
        this.sender_id = sender_id;
        this.ticket_id = ticket_id;
        this.content = content;
        this.is_read = is_read;
        this.created_at = created_at;
    }
}

module.exports = Message;