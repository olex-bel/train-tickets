import { IsNotEmpty, IsInt  } from "class-validator";

export class JourneyStationDto {
    @IsNotEmpty()
    @IsInt()
    departureStationId: number;

    @IsNotEmpty()
    @IsInt()
    arrivalStationId: number;
}