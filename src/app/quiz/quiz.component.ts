import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Question } from '../interface/question';
import { Result } from '../interface/result';
import { interval, Subscription } from 'rxjs'; 
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit{

  @Output() finalResult = new EventEmitter();

  public questions: Array<any>;
  public selected = {} as Question;
  public result = {} as Result;
  
  public index : number;
  public answer : string;
  public name: string="";
  public timer: number = 45; 
  private timerSubscription: Subscription | undefined;

  constructor(){
    this.questions = [];
    this.reset();
  }
  ngOnInit(): void{
    this.name = localStorage.getItem("name")!;
   }
  showQuestion(index:number):void{
    this.selected = this.questions[index];
    this.resetTimer();
  }
  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.nextQuestion();
      }
    });
    
  }
  resetTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timer = 45; 
    this.startTimer(); 
  }

  nextQuestion():void{
    this.checkAnswer();
    this.index++;
    if(this.questions.length > this.index){
      this.answer = '';
      this.showQuestion(this.index);
    }else{
      this.finishQuiz();
    }
  }
 
  checkAnswer(){
    let isAnswer = this.questions[this.index].correct_answers[this.answer];
    (isAnswer === 'true') ? this.result.correct++ : this.result.wrong++;
    
  }

  finishQuiz():void{
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.result.total = this.questions.length;
    this.result.correctPercentage = (this.result.correct / this.result.total) * 100;
    this.result.wrongPercentage = (this.result.wrong / this.result.total) * 100;
    
    this.finalResult.emit(this.result);

  }

  reset() : void{
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.answer = '';
    this.index = 0;
    this.result = {
      total : 0,
      correct : 0,
      wrong : 0,
      correctPercentage : 0,
      wrongPercentage : 0
    };
    this.timer = 45; 
    this.startTimer();
  }

}