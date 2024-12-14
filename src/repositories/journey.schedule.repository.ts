import { Repository } from 'typeorm';
import JourneySchedule from '../entity/journey.schedule.entity';
import TrainJourney from 'src/entity/train.journey.entity';

export interface IJourneyScheduleRepository extends Repository<JourneySchedule> {
    this: Repository<JourneySchedule>;
  
    getJourneysToCreate(dayOfWeek: string, processingDay: Date): Promise<JourneySchedule[]>;
};

export type CustomJourneyScheduleMethods = Pick<IJourneyScheduleRepository, 'getJourneysToCreate'>;
export type CustomJourneyScheduleRepository = Repository<JourneySchedule> & CustomJourneyScheduleMethods;

export const customJourneyScheduleRepository: CustomJourneyScheduleMethods = {
    getJourneysToCreate: async function (this: CustomJourneyScheduleRepository, dayOfWeek: string, processingDay: Date) {
        return this.createQueryBuilder('js')
            .leftJoinAndSelect("js.route", "route")
            .where('js.dayOfWeek = :dayOfWeek', { dayOfWeek })
            .andWhere((qb) => {
                const subQuery = qb.subQuery()
                    .from(TrainJourney, 'tj')
                    .select('id')
                    .where('start_date = cast(:startDate as DATE) + js.departure_time')
                    .andWhere('route_id = js.route_id')
                    .getQuery();
                
                return `NOT EXISTS (${subQuery})`
            })
            .setParameter('startDate', processingDay.toISOString().substring(0, 10))
            .getMany();
    }
};
