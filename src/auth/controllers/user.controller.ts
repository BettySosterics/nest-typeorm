import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { Observable, of, switchMap } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserService } from '../services/user.service';

interface FileParams {
  fileName: string;
}

@Controller('user')
export class UserController {
  constructor(private UserService: UserService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
      fileFilter: (
        _req: any,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          // Accept the file
          cb(null, true);
        } else {
          // Reject the file
          cb(null, false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @Request() req,
  ): Promise<UpdateResult | { error: string }> {
    const fileName = file?.filename;

    if (!fileName) return Promise.resolve({ error: 'File must be an image' });
  }

  @UseGuards(JwtGuard)
  @Get('image')
  findImage(@Request() req, @Res() res): Observable<Object> {
    const userId = req.user.id;
    return this.UserService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: './uploads' }));
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image-name')
  findUserImageName(@Request() req): Observable<{ imageName: string }> {
    const userId = req.user.id;
    return this.UserService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of({ imageName });
      }),
    );
  }
}
//   @UseGuards(JwtGuard, RolesGuard)
//   @Post('upload')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads',
//         filename: (req, file, cb) => {
//           cb(null, file.originalname);
//         },
//       }),
//     }),
//   )
//   uploadImage(
//     @UploadedFile() file: Express.Multer.File,
//     @Request() req,
//   ): Observable<UpdateResult | { error: string }> {
//     const fileName = file?.filename;

//     if (!fileName) return of({ error: 'File must be an image' });

//     const imagesFolderPath = join(process.cwd(), 'images');
//     const fullImagePath = join(imagesFolderPath + '/' + file.filename);
//   }
//   return isFileExtensionSafe(fullImagePath).pipe(
//     switchMap((isFileLegit: boolean) => {
//       if (isFileLegit) {
//         const userId = req.user.id;
//         return this.UserService.updateUserImageById(userId, fileName);
//       }
//       removeFile(fullImagePath);
//       return of({ error: 'File content does not match the extension!' });
//     }),
//     );
//   }

//   @UseGuards(JwtGuard)
//   @Get('image')
//   findImage(@Request() req, @Res() res): Observable<Object> {
//     const userId = req.user.id;
//     return this.UserService.findImageNameByUserId(userId).pipe(
//       switchMap((imageName: string) => {
//         return of(res.sendFile(imageName, { root: './uploads' }));
//       }),
//     );
//   }
// }
