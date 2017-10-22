import { Component } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import  'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable'

interface Post {
  title: string;
  content: string;
}

interface PostId {
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  postsCol: AngularFirestoreCollection<Post>;
  posts: any;

  title: string;
  content: string;

  postDoc: AngularFirestoreDocument<Post>;
  post: Observable<Post>;

  constructor(private afs: AngularFirestore) {

  }

  ngOnInit() {
    this.postsCol = this.afs.collection('posts');
    //this.posts = this.postsCol.valueChanges();
    this.posts = this.postsCol.snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
  }

  addPost(){
    this.afs.collection('posts').add({'title': this.title, 'content': this.content});
    //this.afs.collection('posts').doc('my-custom-id').set({'title': this.title, 'content': this.content});
  }

  getPost(PostId){
    this.postDoc = this.afs.doc('posts/'+PostId);
    this.post = this.postDoc.valueChanges();
  }

  deletePost(PostId){
    this.afs.doc('posts/'+ PostId).delete();
  }

}
