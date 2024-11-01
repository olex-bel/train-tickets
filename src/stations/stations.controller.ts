import { Controller, Get, Query } from '@nestjs/common';
import { StationsService } from './stations.service';
import { SearchStationsDto } from './dto/search-stations.dto';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  async findByName(@Query() searchStationsDto: SearchStationsDto) {
    const stations = this.stationsService.findByName(searchStationsDto);
    return stations;
  }
}
