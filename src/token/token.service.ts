import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { addMinutesToDate } from '../utils/data-utils';
import { InvalidReservationTokenException } from '../seats/errors/invalid-reservation-token.exception';

const EXPIRATION_TIME_IN_MINUTES = 5;

@Injectable()
export class TokenService {
    generateToken(): [string, Date] {
        const now = new Date();
        const expirationTime = addMinutesToDate(now, EXPIRATION_TIME_IN_MINUTES);
        const randomPart = crypto.randomBytes(16).toString('hex')
        const expiryPart = Buffer.from(expirationTime.getTime().toString()).toString('base64'); 

        return [`${randomPart}-${expiryPart}`, expirationTime];
    }

    decodeToken(token) {
        const [randomPart, expiryPart] = token.split('-');
    
        if (!randomPart || !expiryPart) {
            throw new Error('Invalid token format');
        }
    
        const expiryTimestamp = parseInt(Buffer.from(expiryPart, 'base64').toString(), 10);
        const expirationTime = new Date(expiryTimestamp);
        const currentTimestamp = Date.now();
      
        if (currentTimestamp > expirationTime.getTime()) {
            throw new InvalidReservationTokenException('Token expired');
        }

        return expirationTime;
    }
}
