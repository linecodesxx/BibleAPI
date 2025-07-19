import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BibleService {
  private translationsCache: Record<string, any> = {};

  constructor() {  }

  private loadTranslation(translation: string): any {
    const key = translation.toLowerCase();
    if (this.translationsCache[key]) {
      return this.translationsCache[key];
    }

    const filename = `${key}.json`;
    const filePath = path.join(process.cwd(), 'src/bible/translations', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Перевод '${translation}' не найден`);
    }

    const file = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(file);
    this.translationsCache[key] = data;

    return data;
  }


  getOneVerse(bookName: string, chapterId: number, verseId: number, translation: string): string {
    const data = this.loadTranslation(translation);
    const book = data.Books.find(
      (b) => b.BookName === decodeURIComponent(bookName),
    );

    if (!book) throw new NotFoundException('Книга не найдена');

    const chapter = book.Chapters.find((c) => c.ChapterId === chapterId);
    if (!chapter) throw new NotFoundException('Глава не найдена');

    const verse = chapter.Verses.find((v) => v.VerseId === verseId);
    if (!verse) throw new NotFoundException('Стих не найден');

    return verse.Text;
  };

  getPeriodVerses(bookName: string, chapterId: number, from: number, to: number, translation: string): string[] {
    const data = this.loadTranslation(translation);
    const book = data.Books.find(
      (b) => b.BookName.toLowerCase() === bookName.toLowerCase(),
    );
    console.log('Ищем книгу:', bookName);
    if (!book) throw new NotFoundException('Книга не найдена');

    const chapter = book.Chapters.find((c) => c.ChapterId === chapterId);
    if (!chapter) throw new NotFoundException('Глава не найдена');
    const verses = chapter.Verses.filter(
      (v) => v.VerseId >= from && v.VerseId <= to,
    );
    console.log('Найдено стихов:', verses.length);
    if(!verses.length) throw new NotFoundException("Стихи не найдены");

    return verses.map(v => v.Text);
  };

  getRandomVerse(translation: string):{ book: string; chapter: number; verseId: number; text: string }{
    const data = this.loadTranslation(translation);
    const books = data.Books;
    const randomBook = books[Math.floor(Math.random() * books.length)];

    const chapters = randomBook.Chapters;
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];

    const verses = randomChapter.Verses;
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
  
    return {
      book: randomBook.BookName,
      chapter: randomChapter.ChapterId,
      verseId: randomVerse.VerseId,
      text: randomVerse.Text,
  };
  };

  getFullChapter(bookName: string, chapterId: number, translation: string): any[] {
    console.log('🔍 Ищем книгу:', bookName);
    const data = this.loadTranslation(translation);

    const book = data.Books.find(
      (b) => b.BookName.trim().toLowerCase() === bookName.trim().toLowerCase()
    );

    if (!book) {
      console.log('❌ Книга не найдена');
      throw new NotFoundException('Книга не найдена');
    }

    console.log('✅ Книга найдена:', book.BookName);

    const chapter = book.Chapters.find(c => c.ChapterId === chapterId);
    if (!chapter) {
      console.log('❌ Глава не найдена');
      throw new NotFoundException('Глава не найдена');
    }

    console.log('✅ Глава найдена, стихов:', chapter.Verses.length);

    return chapter.Verses.map(v => ({
      verseId: v.VerseId,
      text: v.Text
    }));
  };

  // getDaily(): {book: string; chapter: number; verseId: number; text: string} {  };
  
  getBooks(translation: string): any[] {
    const data = this.loadTranslation(translation);
    return data.Books.map(b => b.BookName)
  };

  getChapters(bookName: string, translation: string): {chapterId: Number} {
    const data = this.loadTranslation(translation);
    const book = data.Books.find(
      (b) => b.BookName === decodeURIComponent(bookName)
    );
    if (!book) throw new NotFoundException('Книга не найдена');

    return{ 
      chapterId: book.Chapters.map(c => c.ChapterId)
  
    }
  };

  getVerses(bookName:string, chapterId: number, translation: string): { versesId: number } { 
    const data = this.loadTranslation(translation);
    const book = data.Books.find(
      (b) => b.BookName === decodeURIComponent(bookName)
    );
    if (!book) throw new NotFoundException('Книга не найдена');

    const chapter = book.Chapters.find(
      (c) => c.ChapterId === chapterId
    );
    if (!chapter) throw new NotFoundException('Главы не найдены');

    return {
        versesId: chapter.Verses.map(
          v => v.VerseId
        )
    } 
  }
}