import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  PublicFile,
  PublicFileDocument,
} from '~modules/common/schemas/publicFile.schema';
import { IdToString } from '~utils/decorators/id-to-string.decorator';

@Injectable()
@IdToString
export class PublicFilesRepository {
  constructor(
    @InjectModel(PublicFile.name)
    private publicFileModel: Model<PublicFileDocument>,
  ) {}

  public async create(params): Promise<PublicFile> {
    const publicFile = await this.publicFileModel.create(params);

    return publicFile;
  }

  public async delete(id): Promise<void> {
    await this.publicFileModel.deleteOne({ _id: id });

    return;
  }
}
