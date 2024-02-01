import {
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Observable, of, switchMap } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { Roles } from '../decorators/roles.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { removeFile, saveImageToStorage } from '../helpers/image-store';
import { Role } from '../models/role.enum';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private UserService: UserService) {}
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<UpdateResult | { error: string }> {
    const fileName = file?.filename;

    if (!fileName) return of({ error: 'File must be an image' });

    // const imagesFolderPath = join(process.cwd(), 'images');
    // const fullImagePath = join(imagesFolderPath + '/' + file.filename);

    // return isFileExtensionSafe(fullImagePath).pipe(
    //   switchMap((isFileLegit: boolean) => {
    //     if (isFileLegit) {
    //       const userId = req.user.id;
    //       return this.UserService.updateUserImageById(userId, fileName);
    //     }
    //     removeFile(fullImagePath);
    //     return of({ error: 'File content does not match the extension!' });
    //   }),
    // );
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
}
