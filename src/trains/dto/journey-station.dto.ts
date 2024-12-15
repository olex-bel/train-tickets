import { IsNotEmpty, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class JourneyStationDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    departureStationId: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    arrivalStationId: number;
}