class TicketParticipants {
    constructor(ticket_id, user_id, role_in_ticket, joined_at) {
        this.ticket_id = ticket_id;
        this.user_id = user_id;
        this.role_in_ticket = role_in_ticket;
        this.joined_at = joined_at;
    }
}

module.exports = TicketParticipants;