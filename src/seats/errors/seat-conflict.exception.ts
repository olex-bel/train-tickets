
export class SeatConflictException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SeatConflictException';
        Object.setPrototypeOf(this, SeatConflictException.prototype);
    }
}