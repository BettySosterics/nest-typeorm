import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private jwtService: JwtService,
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

  validateUser(email: string, password: string): Observable<User> {
    return from(
      this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.email',
          'user.password',
          'user.role',
        ])
        .where('user.email = :email', { email })
        .getOne(),
    ).pipe(
      switchMap((user: User) =>
        from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.password;
              return user;
            }
          }),
        ),
      ),
    );
  }
  login(user: User): Observable<string> {
    const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if (user) {
          // create JWT credentials
          return from(this.jwtService.signAsync({ user }));
        }
      }),
    );
  }
}
