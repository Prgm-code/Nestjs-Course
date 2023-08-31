import { FlightDto } from './dto/flight.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IFlight } from 'common/interface/flight.interface';
import { FLIGHT } from 'common/models/models';
import { Model } from 'mongoose';

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(FLIGHT.name) private readonly model: Model<IFlight>,
  ) {}

  async create(flightDto: FlightDto) {
    const flight = new this.model(flightDto);
    return await flight.save();
  }

  async findAll() {
    return await this.model.find().populate('passengers');
  }

  async findOne(id: string): Promise<IFlight> {
    return await this.model.findById(id).populate('passengers');
  }

  async update(id: string, flightDto: FlightDto): Promise<IFlight> {
    return await this.model.findByIdAndUpdate(id, flightDto, { new: true });
  }

  async delete(id: string) {
    const res = await this.model.findByIdAndDelete(id);
    if (!res) return { status: HttpStatus.NOT_FOUND, message: 'Not found' };
    return { status: HttpStatus.OK, message: 'Flight deleted successfully' };
  }

  async addPassenger(flightId: string, passengerId: string): Promise<IFlight> {
    return await this.model
      .findByIdAndUpdate(
        flightId,
        {
          $addToSet: { passengers: passengerId },
        },
        { new: true },
      )
      .populate('passengers');
  }
}
