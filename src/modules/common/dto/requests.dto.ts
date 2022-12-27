import { IsMongoId } from 'class-validator';

export class GetId {
  @IsMongoId()
  id: string;
}
