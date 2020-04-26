import { Component } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  colorEnd:any = '#ff0000';
  colorStart:any = '#000000';
  backgroundColor = '#000000';
  showBackground:any="false"
  percent:number=0;
  radius:number=100;
  fullTime:any='00:00:15';

  timer:any = false;
  progress:any = 0;
  minutes: number = 1;
  seconds:any = 30;

  elapsed:any={
    h:"00",
    m:"00",
    s:"00"
  }
  overallTimer:any = false;

  startTimer(){
    if(this.fullTime!='00:00:00'){
      this.backgroundColor=this.colorStart;
      this.showBackground='false';
      if(this.timer){
        clearInterval(this.timer);
      }
      if(!this.overallTimer){
        this.progressTimer();
        this.insomnia.keepAwake();
      }
      this.timer = false;
      this.percent = 0;
      this.progress = 0;
  
      let timeSplit =  this.fullTime.split(':');
      this.minutes = timeSplit[1];
      this.seconds = timeSplit[2];
    
      let totalSeconds = Math.floor(this.minutes*60)+parseInt(this.seconds);
      //this.fullTime=0;
      totalSeconds--;//quitar esta linea en caso de quitar el punto rojo
      this.timer = setInterval(()=>{
        this.progress++;
        if(this.percent == this.radius){
          this.playSound();
          this.backgroundColor=this.colorEnd;
          this.showBackground='true';
          clearInterval(this.timer); 
          this.stopTimer();
        }
        this.percent = Math.floor((this.progress/totalSeconds)*100);        
      },1000);
    }
  }
  progressTimer(){
    let countDownDate = new Date();
    this.overallTimer = setInterval( ()=>{
      let now = new Date().getTime();
      let distance = now - countDownDate.getTime();
      this.elapsed.h = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
      this.elapsed.m = Math.floor((distance % (1000*60*60)) / (1000*60));
      this.elapsed.s = Math.floor((distance % (1000*60)) / (1000));

      this.elapsed.h = this.pad(this.elapsed.h,2);
      this.elapsed.m = this.pad(this.elapsed.m,2);
      this.elapsed.s = this.pad(this.elapsed.s,2);
    },1000) 
  }
  pad(num,size){
    let s = num+"";
    while (s.length<size) s="0"+s;
    return s;
  }
  stopTimer(){
    clearInterval(this.timer);
    clearInterval(this.overallTimer);
    this.overallTimer = false;
    this.timer = false;
    this.percent = 0;
    this.progress = 0;
    this.elapsed = {
      h:'00',
      m:'00',
      s:'00'
    }
    this.insomnia.allowSleepAgain();
  }
  constructor(private insomnia:Insomnia) {

  }

  playSound() {
    const audio = new Audio('assets/sonido.mp3');
    audio.play();
  }
}
