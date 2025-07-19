import { Controller, Get, Param } from '@nestjs/common';
import { BibleService } from './bible.service';
import * as path from 'path';
import * as fs from 'fs';

// api.com/bible/verse/:bookName/:chapterId/:verseId/:translation

@Controller('bible')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get('verse/:bookName/:chapterId/:verseId/:translation')
  getOneVerse(
    @Param('bookName') bookName: string,
    @Param('chapterId') chapterId: string,
    @Param('verseId') verseId: string,
    @Param('translation') translation: string
  ) {
    const decodedBookName = decodeURIComponent(bookName);
    return this.bibleService.getOneVerse(decodedBookName, +chapterId, +verseId, translation);
    };

  @Get('verse/:bookName/:chapterId/range/:periodVersesId/:translation')
  getPeriodVerses(
    @Param('bookName') bookName: string,
    @Param('chapterId') chapterId: string,
    @Param('periodVersesId') periodVersesId: string, 
    @Param('translation') translation: string
  ) {
      const decodedBookName = decodeURIComponent(bookName);
      const [from, to] = periodVersesId.split("-").map(Number);
      console.log('Запрос:', { bookName, chapterId, from, to });
      return this.bibleService.getPeriodVerses(decodedBookName, +chapterId, +from, +to, translation)
    };

  @Get('verse/randomVerse/:translation')
  getRandomVerse(
    @Param('translation') translation: string
  ){
    return this.bibleService.getRandomVerse(translation);
  };

//  @Get('verse/getDaily')
//  getDaily(){
//    return this.bibleService.getDaily();
//  }

  @Get('getBooks/:translation')
  getBooks(
    @Param('translation') translation: string,
  ){
    return this.bibleService.getBooks(translation)
  };

  @Get(':bookName/getChapters/:translations')
  getChapters(
    @Param('translation') translation: string,
    @Param('bookName') bookName: string,
  ){
    const decodedBookName = decodeURIComponent(bookName);
    return this.bibleService.getChapters(decodedBookName, translation);
  };

  @Get(':bookName/:chapterId/getVerses')
  getVerses(
    @Param('translation') translation: string,
    @Param('bookName') bookName: string,
    @Param('chapterId') chapterId: string,
  ){
    const decodedBookName = decodeURIComponent(bookName);
    return this.bibleService.getVerses(decodedBookName, +chapterId, translation)
  }

  @Get("fullChap/:bookName/:chapterId/:translation")
  getFullChapter(
    @Param('bookName') bookName:string,
    @Param('chapterId') chapterId: string,
    @Param('translation') translation: string
  ){
    const decodedBookName = decodeURIComponent(bookName);
    return this.bibleService.getFullChapter(decodedBookName, +chapterId, translation);
  }

  @Get('translations')
  getAvailableTranslations(): string[] {
  const dir = path.join(process.cwd(), 'src/bible/translations');
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.basename(file, '.json').toUpperCase());
  }

}