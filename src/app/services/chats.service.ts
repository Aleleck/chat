import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ProfileUser } from '../models/user-profile';
import { Observable } from 'rxjs';
import { concatMap, map, filter, take } from 'rxjs/operators';
import { UsersService } from './users.service';
import { Timestamp, addDoc, collection, doc, orderBy, query, updateDoc, where, DocumentReference } from 'firebase/firestore';
import { Chat, Message } from '../models/chats';
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
      filter((user: ProfileUser | null): user is ProfileUser => user !== null),
      concatMap(user => addDoc(ref,{
        userIds :[user.uid, otherUser?.uid],
        users:[
          {
            displayName: user.displayName ?? '',
            photoURL: user.photoURL ?? ''
          },
          {
            displayName: otherUser?.displayName ?? '',
            photoURL: otherUser?.photoURL ?? ''
          }
        ]
      })),
      map((ref: DocumentReference) => ref.id)
    )
  }
  
  

  get myChats$(): Observable<Chat[]> {
    const ref = collection(this.firestore, 'chats');
    return this.usersServive.currentUserProfile$.pipe(
      take(1),
      concatMap(user => {
        const myQuery = query(ref, where('userIds', 'array-contains', user?.uid))
        return collectionData(myQuery, { idField:'id'}).pipe(
          map(chats => this.addChatNameAndPic(user?.uid ?? '', chats as Chat[]))
        ) as Observable<Chat[]>
      })
    )
  }
  
  isExistingChat(otherUserId: string): Observable<string | null>{
    return this.myChats$.pipe(
      take(1),
      map(chats => {
        
        for(let i=0; i < chats.length; i++){
          if(chats[i].userIds.includes(otherUserId)){
            return chats[i].id;
          }
        }
        return null
      })
    )
  }

  addChatMesssage(chatId: string, message: string):Observable<any>{
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const chatRef = doc(this.firestore, 'chats', chatId);
    const today = Timestamp.fromDate(new Date());
    return this.usersServive.currentUserProfile$.pipe(
      take(1),
      concatMap((user) => addDoc(ref, {
        text: message,
        senderId: user?.uid,
        sentDate: today
      })),
      concatMap(()=> updateDoc(chatRef, {lastMessage: message, lastMessageDate: today}))
    )
  }

  getChatMessages$(chatId: string): Observable<Message[]>{
    const ref = collection(this.firestore, 'chats', chatId, 'messages' ); // Corregir la ruta a 'message'
    const queryAll = query(ref, orderBy('sentDate', 'asc' ))
    return collectionData(queryAll) as Observable<Message[]>
  }

  addChatNameAndPic(currentUserId: string, chats: Chat[]): Chat[]{
    chats.forEach(chat => {
      const otherIndex = chat.userIds.indexOf(currentUserId) === 0 ? 1 : 0;
      const { displayName, photoURL } = chat.users[otherIndex];
      chat.chatName = displayName;
      chat.chatPic = photoURL;
    });
    return chats;
  }
  
}
