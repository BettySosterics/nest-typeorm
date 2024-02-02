import {
  Controller,
  Get,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable, of, switchMap } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserService } from '../services/user.service';

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
    await this.UserService.updateUserImageById(req.user.id, fileName);
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
