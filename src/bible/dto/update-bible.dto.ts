import { PartialType } from '@nestjs/mapped-types';
import { CreateBibleDto } from './create-bible.dto';

export class UpdateBibleDto extends PartialType(CreateBibleDto) {}
