import { IsNotEmpty, IsNumberString  } from "class-validator";

export class JourneyStationDto {
    @IsNotEmpty()
    @IsNumberString ()
    departureStationId: number;

    @IsNotEmpty()
    @IsNumberString ()
    arrivalStationId: number;
}