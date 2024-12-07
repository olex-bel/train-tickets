import { IsNotEmpty, IsNumberString, IsString, MaxLength, ArrayMaxSize, IsOptional } from "class-validator";

export class SeatsReserveDto {
    @IsNotEmpty()
    @IsNumberString ()
    departureStationId: number;

    @IsNotEmpty()
    @IsNumberString ()
    arrivalStationId: number;

    @IsNotEmpty()
    @ArrayMaxSize(4)
    seats: number[];

    @IsString()
    @IsOptional()
    @MaxLength(64)
    token: string;
}
