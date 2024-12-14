import { IsNotEmpty, IsInt, IsString, MaxLength, ArrayMaxSize, IsOptional } from "class-validator";

export class SeatsReserveDto {
    @IsNotEmpty()
    @IsInt()
    departureStationId: number;

    @IsNotEmpty()
    @IsInt()
    arrivalStationId: number;

    @IsNotEmpty()
    @ArrayMaxSize(4)
    seats: number[];

    @IsString()
    @IsOptional()
    @MaxLength(64)
    token: string;
}
