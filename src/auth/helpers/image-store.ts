import FileType from 'file-type';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import path = require('path');
import { from, Observable, of, switchMap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

type validFileExtension = 'jpg' | 'jpeg' | 'png';
type validMimeType = 'image/jpg' | 'image/jpeg' | 'image/png';

const validFileExtensions: validFileExtension[] = ['jpg', 'jpeg', 'png'];
const validMimeTypes: validMimeType[] = [
  'image/jpg',
  'image/jpeg',
  'image/png',
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    cb: (arg0: null, arg1: boolean) => void,
  ) => {
    const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

// export const isFileExtensionSafe = (
//   fullFilePath: string,
// ): Observable<boolean> => {
//   return from(FileType.fromFile(fullFilePath)).pipe(
//     switchMap((fileExtensionAndMimeType: FileType.FileTypeResult | null) => {
//       if (!fileExtensionAndMimeType) return of(false);

//       const isFileTypeLegit = validFileExtensions.includes(
//         fileExtensionAndMimeType.ext as validFileExtension,
//       );
//       const isMimeTypeLegit = validMimeTypes.includes(
//         fileExtensionAndMimeType.mime as validMimeType,
//       );
//       const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
//       return of(isFileLegit);
//     }),
//   );
// };

// export const isFileExtensionSafe = (
//   fullFilePath: string,
// ): Observable<boolean> => {
//   return from(fs.promises.readFile(fullFilePath)).pipe(
//     switchMap(async (buffer) => {
//       const fileExtensionAndMimeType = await FileType.fromBuffer(buffer);
//       if (!fileExtensionAndMimeType) return false;

//       const isFileTypeLegit = validFileExtensions.includes(
//         fileExtensionAndMimeType.ext as validFileExtension,
//       );
//       const isMimeTypeLegit = validMimeTypes.includes(
//         fileExtensionAndMimeType.mime as validMimeType,
//       );
//       const isFileLegit = isFileTypeLegit && isMimeTypeLegit;

//       return isFileLegit;
//     }),
//   );
// };

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {
    console.error(err);
  }
};
