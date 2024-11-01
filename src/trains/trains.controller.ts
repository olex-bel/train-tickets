import { Controller, Get, Query } from '@nestjs/common';
import { TrainsService } from './trains.service';
import { SearchTrainsDto } from './dto/search-trains.dto';

@Controller('trains')
export class TrainsController {

  constructor(private readonly trainsService: TrainsService) {}

  @Get('find')
  async findTrains(@Query() searchTrainsDto: SearchTrainsDto) {
    return this.trainsService.findTrains(searchTrainsDto);
  }
}
