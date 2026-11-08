import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { FilmsService } from './films.service.js';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll(@Query('ditonton') ditonton?: string) {
    return this.filmsService.getAllFilms(ditonton);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmsService.getFilmById(id);
  }

  @Post()
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmsService.createFilm(createFilmDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto) {
    return this.filmsService.updateFilm(id, updateFilmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmsService.removeFilm(id);
  }
}