import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { user } from 'rxfire/auth';
import { combineLatest, map, startWith } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;
  searchControl = new FormControl('');
  users$ = combineLatest([
    this.usersService.allUsers$,
    this.user$,
    this.searchControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([users, user, searchString]) => {
      // Asegúrate de que user y searchString no sean undefined ni null
      if (user === undefined || user === null || searchString === undefined || searchString === null) {
        return [];
      }

      // Filtra los usuarios basados en la búsqueda y el usuario actual
      return users.filter(u =>
        u.displayName?.toLowerCase().includes(searchString.toLowerCase()) && u.uid !== user.uid
      );
    })
  );

  constructor(private usersService: UsersService, private chatsService: ChatsService ) { }

  ngOnInit(): void { }

  createChat (otherUser: ProfileUser){
    this.chatsService.createChat(otherUser).subscribe();
  }
}
