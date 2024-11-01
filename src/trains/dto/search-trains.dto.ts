
import { IsISO8601, IsNotEmpty, IsNumberString  } from "class-validator";

export class SearchTrainsDto {
    @IsNotEmpty()
    @IsNumberString ()
    departureStationId: number;

    @IsNotEmpty()
    @IsNumberString ()
    arrivalStationId: number;

    @IsISO8601()
    @IsNotEmpty()
    travelDate: string;
}