import { HttpStatus, Injectable } from '@nestjs/common';
import { PassengerDto } from './dto/passenger.dto';
import { IPassenger } from '../common/interface/passenger.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PASSENGER } from '../common/models/models';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel(PASSENGER.name) private readonly model: Model<IPassenger>,
  ) {}

  async create(passengerDto: PassengerDto): Promise<IPassenger> {
    const newPassenger = new this.model(passengerDto);
    return await newPassenger.save();
  }

  async findAll(): Promise<IPassenger[]> {
    return await this.model.find();
  }
  async findOne(id: string): Promise<IPassenger> {
    return await this.model.findById(id);
  }
  async update(id: string, passengerDto: PassengerDto) {
    return await this.model.findByIdAndUpdate(id, passengerDto, { new: true });
  }

  async delete(id: string) {
    const res = await this.model.findByIdAndDelete(id);
    console.log(res);
    if (!res) return { status: HttpStatus.NOT_FOUND, message: 'Not found' };
    return {
      status: HttpStatus.OK,
      message: 'Passenger deleted successfully',
    };
  }
}
