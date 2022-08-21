import { UpsertInfringementDto } from '@modules/infringement/controllers/upsert-infringement.dto';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';

export type AnyInfringementDto = UpsertInfringementDto | CreateInfringementDto | UpdateInfringementDto;
