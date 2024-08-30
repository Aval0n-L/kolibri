import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface QA {
  id?: string;
  question: string;
  answerEn: string;
  answerRu: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  qa: QA = { question: '', answerEn: '', answerRu: '' };
  qaList!: Observable<QA[]>;
  currentCollectionName: string = 'qa';

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.loadCollection(this.currentCollectionName);
  }

  loadCollection(collectionName: string): void {
    this.qaList = this.firestore.collection<QA>(collectionName).valueChanges({ idField: 'id' });
  }

  onSubmit(): void {
    if (this.qa.id) {
      this.firestore.collection(this.currentCollectionName).doc(this.qa.id).update({
        question: this.qa.question,
        answerEn: this.qa.answerEn,
        answerRu: this.qa.answerRu
      }).then(() => {
        console.log('Has been updated successfully.!');
        this.resetForm();
      }).catch(error => {
        console.error('Error updating document: ', error);
      });
    } else {
      this.firestore.collection(this.currentCollectionName).add({
        question: this.qa.question,
        answerEn: this.qa.answerEn,
        answerRu: this.qa.answerRu
      }).then(() => {
        console.log('Has been successfully accepted!');
        this.resetForm();
      }).catch(error => {
        console.error('Error adding document: ', error);
      });
    }
  }

  resetForm(): void {
    this.qa = { question: '', answerEn: '', answerRu: '' };
  }

  onEdit(qa: QA): void {
    this.qa = { ...qa };
  }

  onDelete(qa: QA): void {
    if (qa.id) {
      this.firestore.collection(this.currentCollectionName).doc(qa.id).delete()
        .then(() => {
          console.log('Delete completed!');
        })
        .catch(error => {
          console.error('Delete exception: ', error);
        });
    } else {
      console.error('Error: ID not found to delete.');
    }
  }

  setCollectionName(newName: string): void {
    this.currentCollectionName = newName;
    this.loadCollection(newName);
  }
}
