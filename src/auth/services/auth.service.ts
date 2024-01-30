import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { from, map, Observable, switchMap } from 'rxjs';
import { UserEntity } from 'src/auth/models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.interface';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  register(user: User): Observable<User> {
    const { username, email, password, firstName, lastName } = user;

    return this.hashPassword(password).pipe(
      switchMap((hashedPassword: string) => {
        return from(
          this.userRepository.save({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword,
          }),
        ).pipe(
          map((user: User) => {
            delete user.password;
            return user;
          }),
        );
      }),
    );
  }
}
