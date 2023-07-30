import { Comment } from "./comment";

export class Event {
    id: number;
    organiser: string;
    sport: string;
    pollDeadline: number;
    minParticipants: number;
    maxParticipants: number;
    dateTime: number;
    location: string;
    status: string;
    eventPrice: number;
    pricePerUser: number;
    comments:Array<Comment>;
    participants: Array<string>;
    paid: Array<string>;
}
