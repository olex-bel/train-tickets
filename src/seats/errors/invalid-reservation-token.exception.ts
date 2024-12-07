
export class InvalidReservationTokenException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidReservationTokenException';
        Object.setPrototypeOf(this, InvalidReservationTokenException.prototype);
    }
}