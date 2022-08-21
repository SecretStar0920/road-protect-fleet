import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { User, UserType } from '@modules/shared/models/entities/user.model';
import { Observable } from 'rxjs';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Store } from '@ngrx/store';
import { userNgrxHelper, UserState } from '@modules/user/ngrx/user.reducer';
import { plainToClass } from 'class-transformer';

export class CreateUserDto {
    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsString()
    @IsOptional()
    password?: string;
    @IsEmail()
    email: string;
    @IsString()
    type: UserType;
}

export class UpdateUserDto {
    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsString()
    type: UserType;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpService, private store: Store<UserState>) {}

    getAllUsers() {
        return this.http.getSecure('user').pipe(
            map((response: object[]) => {
                if (response.length && response.length >= 0) {
                    return plainToClass(User, response);
                }
                return [];
            }),
            tap((users) => {
                this.store.dispatch(userNgrxHelper.load({ items: users }));
            }),
        );
    }

    getUser(userId: number) {
        return this.http.getSecure(`user/${userId}`).pipe(
            map((response: object) => {
                return plainToClass(User, response);
            }),
            tap((user) => {
                this.store.dispatch(userNgrxHelper.upsertOne({ item: user }));
            }),
        );
    }

    createUser(dto: CreateUserDto): Observable<User> {
        return this.http.postSecure('user', dto).pipe(
            map((response: object) => {
                return plainToClass(User, response);
            }),
            tap((result) => {
                this.store.dispatch(userNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    updateUser(id: number, dto: UpdateUserDto): Observable<User> {
        return this.http.postSecure(`user/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(User, response);
            }),
            tap((result) => {
                this.store.dispatch(userNgrxHelper.updateOne({ item: { id: result.userId, changes: result } }));
            }),
        );
    }

    resetUserLoginAttempts(id: number): Observable<User> {
        return this.http.getSecure(`user/reset-login-attempts/${id}`).pipe(
            map((response: object) => {
                return plainToClass(User, response);
            }),
            tap((result) => {
                this.store.dispatch(userNgrxHelper.updateOne({ item: { id: result.userId, changes: result } }));
            }),
        );
    }

    deleteUser(userId: number) {
        return this.http.deleteSecure(`user/${userId}`).pipe(
            map((response: object) => {
                return plainToClass(User, response);
            }),
            tap((user) => {
                this.store.dispatch(userNgrxHelper.deleteOne({ id: `${user.userId}` }));
            }),
        );
    }
}
