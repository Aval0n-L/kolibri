import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { QA } from '../admin/admin.component';  

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  collections: string[] = ['dotNet C#', 'Database SQL EF Dapper', 'REST', 'Terrafrom', 'RabbitMQ', 'Microservices', 'Docker', 'Git', 'CI CD', 'OOP SOLID', 'MVVM', 'Angular TypeScript Html Css'];  // Известные имена коллекций
  selectedCollection: string | null = null;  
  qaList: QA[] = [];  
  searchQuery: string = ''; 
  filteredQaList: QA[] = [];  

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
  }

  
  selectCollection(collectionName: string): void {
    this.selectedCollection = collectionName;
    this.firestore.collection<QA>(collectionName).valueChanges({ idField: 'id' }).subscribe(data => {
      this.qaList = data;
      this.filteredQaList = data;
    });
  }

  
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredQaList = this.qaList.filter(qa => 
      qa.question.toLowerCase().includes(query) || 
      qa.answerEn.toLowerCase().includes(query) || 
      qa.answerRu.toLowerCase().includes(query)
    );
  }
}
