import { Component, OnInit, ViewChild } from '@angular/core';
import { SoccerService } from '../../service/soccer.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FootballReports } from '../../models/FootballReports';
import { FormControl, FormBuilder } from '@angular/forms';
import { FootballStatistics } from '../../models/FootballStatistics';
import { Clubs } from '../../models/Clubs';

@Component({
  selector: 'app-soccer',
  templateUrl: './soccer.component.html',
  styleUrls: ['./soccer.component.css']
})
export class SoccerComponent implements OnInit {

  teamFilter = new FormControl();
  scoreFilter = new FormControl();
  dateFilter = new FormControl();
  selectedSeason:string;
  selectedCountry:any;
  points:string = "Club Brugge ";
  ELEMENT_DATA_REPORT : FootballReports[];
  ELEMENT_DATA_STATS : FootballStatistics[];
  home_stats : FootballStatistics = {
    won : 0,
    lost : 0,
    equal : 0,
    points : 0,
    goals: 0,
    conceeded : 0,
    failedToScore : 0,
    cleanSheats:0,
    totalGames:0,
    totalGoals:0,
    team : undefined
  };
  away_stats : FootballStatistics = {
    won : 0,
    lost : 0,
    equal : 0,
    points : 0,
    goals: 0,
    conceeded : 0,
    failedToScore : 0,
    cleanSheats:0,
    totalGames:0,
    totalGoals:0,
    team : undefined
  };
  displayedColumnsReport: String[] = ['date','team1','score','team2'];
  displayedColumnsStat: String[] = ['team','won','lost','equal', 'goals', 'conceeded', 'points'];
  countries: any[] = [{ 
   value: 'Argentina', shortValue: 'ar'},
   {value: 'Austria', shortValue: 'at'},
  { value: 'Belgium', shortValue: 'be' }, 
  //{ value: 'Brazil', shortValue: 'br' }, 
  //{ value: 'China', shortValue: 'cn' }, 
  { value: 'Deutschland', shortValue: 'de' }, 
  { value: 'England', shortValue: 'eng' },
  { value: 'Espana', shortValue: 'es' }, 
  { value: 'France', shortValue: 'fr' },
  { value: 'Greece', shortValue: 'gr' },
  { value: 'Italy', shortValue: 'it' },
  { value: 'Netherlands', shortValue: 'nl' },
  { value: 'Mexico', shortValue: 'mx' },
  //{ value: 'major-league-soccer', shortValue: 'mls' },
  { value: 'Portugal', shortValue: 'pt' },
  { value: 'Scotland', shortValue: 'sco' },
  { value: 'Turkey', shortValue: 'tr' }];
  filterValues = {
    team: '',
    teamOppo: '',
  };
  teams : Clubs[] =[];
  seasons : string[] = [];
  dataSourceReport = new MatTableDataSource<FootballReports>(this.ELEMENT_DATA_REPORT);
  dataSourceStat = new MatTableDataSource<FootballStatistics>(this.ELEMENT_DATA_STATS);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private service:SoccerService, private fb: FormBuilder) { }

  ngOnInit(): void {

    let year : number = 1995;
    let currentYear: number=new Date().getFullYear();
    let diff = (currentYear - year);
    for (var i = 1; i < diff; i++) {
      this.seasons.push((currentYear - i)+"-"+(currentYear - i+1).toString().slice(2, 4));
    }
    this.dataSourceReport.paginator = this.paginator;
    this.dataSourceReport.sort = this.sort;
    this.dataSourceReport.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'date': return new Date(item.date);
        default: return item[property];
      }
    };
    this.selectedSeason = currentYear-1+"-"+currentYear.toString().slice(2, 4);
    this.selectedCountry = { value: this.countries[0].value, shortValue: this.countries[0].shortValue };
    this.getAllReports(this.selectedSeason,this.selectedCountry.value,this.selectedCountry.shortValue);
    this.getAllStatistics(this.selectedSeason,this.selectedCountry.value,this.selectedCountry.shortValue);
    this.getAllClubs(this.selectedSeason,this.selectedCountry.value,this.selectedCountry.shortValue);
    this.dataSourceReport.filterPredicate = this.tableFilterReport();
    this.dataSourceStat.filterPredicate = this.tableFilterStat();
  }

  tableFilterReport(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return (data['team1'].indexOf(searchTerms.team) !== -1
        && data['team2'].indexOf(searchTerms.teamOppo) !== -1) ||
        (data['team1'].indexOf(searchTerms.teamOppo) !== -1
        && data['team2'].indexOf(searchTerms.team) !== -1)
    }
    return filterFunction;
  }

  /*attention: this is just the last element of the list*/
  highestDate(){ 
    let date: string = '';
    this.dataSourceReport.data.forEach((element) => 
    {
     date = element.date; 
    });
    return date;
    }

  tableFilterStat(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
        return (data['team'].indexOf(searchTerms.team) !== -1
        || data['team'].indexOf(searchTerms.teamOppo) !== -1)
    }
    return filterFunction;
  }

  public getAllClubs(date,country,countryShort){
    let resp=this.service.footballClubs(date,country,countryShort);
    resp.subscribe(response=>{
      this.teams=response;
    });
  }

  public getAllReports(date,country,countryShort){
    let resp=this.service.footballReports(date,country,countryShort);
    resp.subscribe(response=>{
      this.dataSourceReport.data=response as FootballReports[];
    });
  }

  public getAllStatistics(date,country,countryShort){
    let resp=this.service.footballStatistics(date,country,countryShort);
    resp.subscribe(response=>{
      this.dataSourceStat.data=response as FootballStatistics[];
    });
  }

  search(selectedTeam: string, selectedOppoTeam: string) {
    this.clearFilters();
    if(selectedTeam != 'select team'){
      this.filterValues.team = selectedTeam;
    }else{
      this.filterValues.team = '';
    }
    if(selectedOppoTeam != 'select team'){
      this.filterValues.teamOppo = selectedOppoTeam;
    }else{
      this.filterValues.teamOppo = '';
    }
    this.dataSourceReport.filter = JSON.stringify(this.filterValues);
    this.dataSourceStat.filter = JSON.stringify(this.filterValues);
     this.dataSourceReport.data.forEach((element) => 
    {
      if(element.team1 == selectedTeam){
        this.home_stats.team = selectedTeam;
        this.home_stats.totalGames = this.home_stats.totalGames + 1;
        let splitted = element.ft.split("-");
        let ownscore = splitted[0];
        let oppscore = splitted[1];
        this.home_stats.totalGoals = this.home_stats.totalGoals + Number(ownscore) + Number(oppscore);
        this.home_stats.goals = this.home_stats.goals + Number(ownscore);
        this.home_stats.conceeded = this.home_stats.conceeded + Number(oppscore);
        if(ownscore > oppscore){
          this.home_stats.won = this.home_stats.won+1;
        }else if(ownscore < oppscore){
          this.home_stats.lost = this.home_stats.lost +1;
        }else{
          this.home_stats.equal = this.home_stats.equal + 1;
        }
        if(Number(ownscore)==0){
          this.home_stats.failedToScore +=1;
        }
        if(Number(oppscore)==0){
          this.home_stats.cleanSheats +=1;
        }
      }
      if(element.team2 == selectedOppoTeam){
        this.away_stats.team = selectedOppoTeam;
        this.away_stats.totalGames = this.away_stats.totalGames + 1;
        let splitted = element.ft.split("-");
        let oppscore = splitted[0];
        let ownscore = splitted[1];
        this.away_stats.totalGoals = this.away_stats.totalGoals + Number(ownscore) + Number(oppscore);
        this.away_stats.goals = this.away_stats.goals + Number(ownscore);
        this.away_stats.conceeded = this.away_stats.conceeded + Number(oppscore);
        if(ownscore > oppscore){
          this.away_stats.won = this.away_stats.won+1;
        }else if(ownscore < oppscore){
          this.away_stats.lost = this.away_stats.lost +1;
        }else{
          this.away_stats.equal = this.away_stats.equal + 1;
        }
        if(Number(ownscore)==0){
          this.away_stats.failedToScore +=1;
        }
        if(Number(oppscore)==0){
          this.away_stats.cleanSheats +=1;
        }
      }
    });
  }

  clearFilters(){
    this.filterValues.team = '';
    this.filterValues.teamOppo = '';
    this.dataSourceReport.filter = '';
    this.dataSourceStat.filter = '';
    this.home_stats  = {
      won : 0,
      lost : 0,
      equal : 0,
      points : 0,
      goals: 0,
      conceeded : 0,
      failedToScore : 0,
      cleanSheats:0,
      totalGames:0,
      totalGoals:0,
      team : undefined
    };
    this.away_stats = {
      won : 0,
      lost : 0,
      equal : 0,
      points : 0,
      goals: 0,
      conceeded : 0,
      failedToScore : 0,
      cleanSheats:0,
      totalGames:0,
      totalGoals:0,
      team : undefined
    };
 }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceReport.filter = filterValue.trim().toLowerCase();
  }

  updateValuesBySeason(season : string){
    this.selectedSeason = season;
    this.getAllClubs(season,this.selectedCountry.value,this.selectedCountry.shortValue);
    this.getAllReports(season,this.selectedCountry.value,this.selectedCountry.shortValue);
    this.getAllStatistics(season,this.selectedCountry.value,this.selectedCountry.shortValue); 
  }

  updateValuesByCountry(country : string){
    let selectedCountry:any;
    this.countries.forEach(function (object) {
      if(country == object.value){
         selectedCountry =  { value: object.value, shortValue: object.shortValue };
      }
    }); 
    this.selectedCountry = selectedCountry;
    this.seasons = [];
    let year : number = 1995;
    if(selectedCountry.shortValue == 'ar'){
      year = 2016;
    }
    if(selectedCountry.shortValue == 'eng'){
      year = 1880;
    }
    if(selectedCountry.shortValue == 'de'){
      year = 1964;
    }
    if(selectedCountry.shortValue == 'at' || selectedCountry.shortValue == 'mx'){
      year = 2012;
    }
    let currentYear: number=new Date().getFullYear();
    let diff = (currentYear - year);
    if(selectedCountry.shortValue == 'cn' ||selectedCountry.shortValue == 'br' ){
      for (var i = 1; i < diff; i++) {
        this.seasons.push((currentYear - i).toString());
      }
      this.selectedSeason=(currentYear-1).toString();
    }else{
      for (var i = 1; i < diff; i++) {
        this.seasons.push((currentYear - i)+"-"+(currentYear - i+1).toString().slice(2, 4));
      }
      this.selectedSeason=(currentYear - 1)+"-"+(currentYear).toString().slice(2, 4);
    }
    this.getAllClubs(this.selectedSeason,selectedCountry.value,selectedCountry.shortValue);
    this.getAllReports(this.selectedSeason,selectedCountry.value,selectedCountry.shortValue);
    this.getAllStatistics(this.selectedSeason,selectedCountry.value,selectedCountry.shortValue);
    this.clearFilters();
  }
 
  clearTeams() {
    this.clearFilters();
    this.getAllReports(this.selectedSeason,this.selectedCountry.value,this.selectedCountry.shortValue);
    this.getAllStatistics(this.selectedSeason,this.selectedCountry.value,this.selectedCountry.shortValue);
  }



}
