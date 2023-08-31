import { PassengerService } from './../passenger/passenger.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { FlightDto } from './dto/flight.dto';
import { FlightService } from './flight.service';
import { ApiTags } from "@nestjs/swagger";


@ApiTags('flight')
@Controller('api/v1/flight')
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly passengerService: PassengerService,
  ) {}

  @Post()
  async create(@Body() flightDto: FlightDto) {
    return this.flightService.create(flightDto);
  }

  @Get()
  async findAll() {
    return this.flightService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.flightService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() flightDto: FlightDto) {
    return this.flightService.update(id, flightDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.flightService.delete(id);
  }

  @Post(':flightId/passenger/:passengerId')
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param('passengerId') passengerId: string,
  ) {
    const passenger = await this.passengerService.findOne(passengerId);
    if (!passenger)
      throw new HttpException('Passenger not found', HttpStatus.NOT_FOUND);

    const passengerOnFlight = await this.flightService.addPassenger(
      flightId,
      passengerId,
    );
    if (!passengerOnFlight)
      throw new HttpException('Flight not found', HttpStatus.NOT_FOUND);
    return passengerOnFlight;
  }
}
