import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';

export interface Film {
  id: string;
  judul: string;
  genre: string;
  tahun: number;
  rating: number;
  sudahDitonton: boolean;
}

@Injectable()
export class FilmsService {
  private films: Film[] = [];
  private filePath = path.join(process.cwd(), 'src', 'films.json');

  constructor() {
    this.loadFilms();
  }

  private loadFilms() {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileData = fs.readFileSync(this.filePath, 'utf8');
        this.films = JSON.parse(fileData);
        console.log('Data film berhasil dimuat:', this.films);
      } else {
        console.error('File films.json tidak ditemukan di:', this.filePath);
      }
    } catch (error) {
      console.error('Gagal membaca films.json', error);
    }
  }

  getAllFilms(ditonton?: string): Film[] {
    if (ditonton !== undefined && ditonton.trim() !== '') {
      const status = ditonton.trim().toLowerCase();
      if (status === 'true') {
        return this.films.filter((f) => Boolean(f.sudahDitonton) === true);
      }
      if (status === 'false') {
        return this.films.filter((f) => Boolean(f.sudahDitonton) === false);
      }
    }
    return this.films;
  }

  getFilmById(id: string): Film {
    const film = this.films.find((f) => f.id === id);
    if (!film) {
      throw new NotFoundException(`Film dengan ID ${id} tidak ditemukan`);
    }
    return film;
  }

  createFilm(createFilmDto: CreateFilmDto): Film {
    const newFilm: Film = {
      id: (this.films.length > 0 ? Math.max(...this.films.map(f => Number(f.id) || 0)) + 1 : 1).toString(),
      judul: createFilmDto.judul,
      genre: createFilmDto.genre,
      tahun: createFilmDto.tahun,
      rating: createFilmDto.rating,
      sudahDitonton: createFilmDto.sudahDitonton ?? false,
    };
    this.films.push(newFilm);
    return newFilm;
  }

  updateFilm(id: string, updateFilmDto: UpdateFilmDto): Film {
    const film = this.getFilmById(id);

    if (updateFilmDto.judul !== undefined) film.judul = updateFilmDto.judul;
    if (updateFilmDto.genre !== undefined) film.genre = updateFilmDto.genre;
    if (updateFilmDto.tahun !== undefined) film.tahun = updateFilmDto.tahun;
    if (updateFilmDto.rating !== undefined) film.rating = updateFilmDto.rating;
    if (updateFilmDto.sudahDitonton !== undefined) film.sudahDitonton = updateFilmDto.sudahDitonton;

    return film;
  }

  removeFilm(id: string): { message: string; id: string } {
    const index = this.films.findIndex((f) => String(f.id) === String(id));

    if (index === -1) {
      throw new NotFoundException(`Film dengan ID ${id} tidak ditemukan`);
    }

    this.films.splice(index, 1);

    return { message: `Film dengan ID ${id} berhasil dihapus`, id };
  }
}