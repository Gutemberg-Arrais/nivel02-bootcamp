import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm'

import AppError from '../errors/AppError'

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface Request {
    provider_id:string;
    date: Date;
}

class CreateAppointmetService {

    public async execute({ date, provider_id }: Request): Promise<Appointment>  {
    const appointmentsRepository = getCustomRepository(AppointmentRepository)

    const parsedDate = startOfHour(date)

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(parsedDate)
 
    if (findAppointmentInSameDate) {
        throw new AppError('This Appointment is already booked')
    }

    const appointment = appointmentsRepository.create({
        provider_id,
        date: parsedDate
    });
    await appointmentsRepository.save(appointment)

    return appointment
    }
}

export default CreateAppointmetService