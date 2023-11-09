import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ProfileUser } from '../models/user';
import { Observable, concatMap, map, take } from 'rxjs';
import { UsersService } from './users.service';
import { addDoc, collection, query, where } from 'firebase/firestore';
import { user } from 'rxfire/auth';
import { Chat } from '../models/chats';
import { collectionData } from 'rxfire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(private firestore: Firestore, private usersServive: UsersService) { }

  createChat(otherUser: ProfileUser): Observable<string>{
    const ref = collection(this.firestore, 'chats');
    return this.usersServive.currentUserProfile$.pipe(
      take(1),
      concatMap(user => addDoc(ref,{
        userIds :[user?.uid, otherUser?.uid],
        users:[
          {
            displayName: user?.displayName ?? '',
            photoURL: user?.photoURL ?? ''
          },
          {
            displayName: otherUser?.displayName ?? '',
            photoURL: otherUser?.photoURL ?? ''
          }
        ]
      })),
      map(ref => ref.id)
    )
  }

  get myChats$(): Observable<Chat[]> {
    const ref = collection(this.firestore, 'chats');
    return this.usersServive.currentUserProfile$.pipe(
      concatMap((user) => {
        const myQuery = query(ref, where('userIds', 'array-contains', user?.uid))
        return collectionData(myQuery, { idField:'id'}) as Observable<Chat[]>
      })
    )
  }

  addChatNameAndPic(currentUserId: string, chats: Chat[]): Chat[]{
    chats.forEach(chat => {
      const otherIndex = chat.userIds .indexOf(currentUserId) === 0 ? 1:  0;
      const {displayName, photoURL} = chat.users[otherIndex];
      chat.chatName= displayName;
      chat.chatPic = photoURL;
    })
    return chats;
  }
}
