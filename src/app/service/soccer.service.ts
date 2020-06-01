import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { FootballReports } from '../models/FootballReports';
import { FootballStatistics } from '../models/FootballStatistics';
import { Observable } from 'rxjs';
import { Clubs } from '../models/Clubs';
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER } from '@angular/cdk/overlay/overlay-directives';

@Injectable({
  providedIn: 'root'
})
export class SoccerService {

  private api_url:any;

  constructor(private http:HttpClient) { 
    this.api_url = "https://raw.githubusercontent.com/footballcsv";
  }

  public footballStatistics(season: string,country:string,countryShort:string){
    return this.getFootballReportsByDate(season,country,countryShort).pipe(
      map(result=>{
        let rows = result.split('\n');
        let map = new Map();  
        let mainData = [];
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row=>{
        row = row.replace(/ *\([^)]*\) */g, "");
        let cols = row.split(/,(?=\S)/);
        if(cols.length >= 5){
          for(var i=0; i < 2; i++){
            let team = cols[2].trim();
            if(i==1){
              team = cols[5].trim();
            }
            if(map.get(team) == undefined){
              let won = 0;
              let lost = 0;
              let equal = 0;
              let points = 0;
              let goals = 0;
              let conceeded = 0;
              let fs : FootballStatistics = {
                won : won,
                lost : lost,
                equal : equal,
                points : points,
                goals: goals,
                conceeded : conceeded,
                failedToScore : 0,
                cleanSheats:0,
                totalGames:0,
                totalGoals:0,
                team : team
              }
            map.set(team,fs);
          }
          let fs = map.get(team);
          let out = cols[3].replace(/\s/g, "");
          let splitted = out.split("-");
          let ownscore = splitted[0];
          let oppscore = splitted[1];
          if(i==1){
            ownscore = splitted[1];
            oppscore = splitted[0];
          }
          fs.goals = fs.goals+ Number(ownscore);
          fs.conceeded = fs.conceeded + Number(oppscore);
          if(ownscore > oppscore){
            fs.won = fs.won+1;
            fs.points = fs.points +3;
          }else if(ownscore < oppscore){
            fs.lost = fs.lost +1;
          }else{
            fs.equal = fs.equal + 1;
            fs.points = fs.points+1;
          }
        }
      }
        })
      mainData = Array.from(map.values());
      mainData.sort(function(a, b) {
        let pointsA = a.points;
        let pointsB = b.points;
        return (pointsA < pointsB) ? 1 : (pointsA > pointsB) ? -1 : 0;
    });
      return mainData;
      }))
  }

  public footballReports(season: string,country,countryShort){
    return this.getFootballReportsByDate(season,country,countryShort).pipe(
      map(result=>{
        let rows = result.split('\n');
        let mainData = [];
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row=>{
          row = row.replace(/ *\([^)]*\) */g, "");
          let cols = row.split(/,(?=\S)/);
          if(cols.length>=6){
          let round = cols[0].trim();
          let date = cols[1].trim();
          let team1= cols[2].trim();
          let ft = cols[3].trim();
          let ht = cols[4].trim();
          let team2 = cols[5].trim();
          let fr : FootballReports = {
            round : round,
            date : date,
            team1 : team1,
            ft : ft,
            ht : ht,
            team2 : team2,
          }
          mainData.push(fr)
        }
        
        })
      return mainData;
      }))
  }


  public footballClubs(season: string,country,countryShort){
    return this.getFootballReportsByDate(season,country,countryShort).pipe(
      map(result=>{
        let map = new Map();  
        let rows = result.split('\n');
        let mainData = [];
        let header = rows[0];
        rows.splice(0, 1);
        let count = 0;
        let club : Clubs = {
          name : 'select team',
          id : count
        }
        map.set(name, club);
        rows.forEach(row=>{
          row = row.replace(/ *\([^)]*\) */g, "");
          let cols = row.split(/,(?=\S)/);
          let team= cols[2];
          if(map.get(team) == undefined){
            count = count + 1;
            let club : Clubs = {
              name : team,
              id : count
            }
            map.set(team, club);
          }
        })
      mainData = Array.from(map.values());
      mainData.sort((a, b) => {
        let nameA = a.name;
        let nameB = b.name;
        if(nameA == 'select team'){
          return -1
        }
        if(nameB == 'select team'){
          return 1
        }
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
      });
      return mainData;
      }))
  }

  getFootballReportsByDate(season: string,country:string,countryShort){
    country = country.toLocaleLowerCase();
    if(country=='england'|| country=='espana' || country=='deutschland'){
      let year = season.toString().substring(0, 4);
      let decade = this.getDecadesFromYear(Number(year));
      season = decade + "s/" + season;
    }
    
    //if(countryShort == 'mls'){
      //return this.http.get(this.api_url + '/'+country + '/master/'+season+'/1-mls.csv',{responseType : 'text'});
    //}
    if(country == 'argentina' || country == 'china' || country == 'brazil'){
      country = 'world';
    }
 

    return this.http.get(this.api_url + '/'+country + '/master/'+season+'/'+countryShort+'.1.csv',{responseType : 'text'});
  }

  getDecadesFromYear(year: number){
    if (Number.isNaN(year) || (year.toString().length < 4) || (year.toString().length > 4)) {
        throw new Error('Date must be valid and have a 4-digit year attribute');
    }
    let start       = Number(`${year.toString()[2]}0`);
    let startIdx    = year.toString().substring(0, 2);
    let end         = 0;
    start           = (start === 0) ? Number(`${startIdx}00`) : Number(`${startIdx}${start}`);
    return start;
}
  
}
