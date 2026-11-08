import { PartialType } from '@nestjs/mapped-types';
import { CreateFilmDto } from './create-film.dto.js';

export class UpdateFilmDto extends PartialType(CreateFilmDto) {}