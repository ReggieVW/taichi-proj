import { Component, OnInit, ViewChild } from '@angular/core';
import { JavatechieCovid19Service } from '../javatechie-covid19.service';
import { CountryReports } from 'src/countryReports';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css']
})
export class Covid19Component implements OnInit {
  

  cases: number;
  todayCases: number;
  deaths: string;
  todayDeaths: string;
  recovered: number;
  active: number;
  critical: string;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: string;
  testsPerOneMillion:string;

  ELEMENT_DATA : CountryReports[];
  displayColumns: String[] = ['country','cases','todayCases',
'deaths','todayDeaths','recovered','active','critical','casesPerOneMillion',
'deathsPerOneMillion','tests','testsPerOneMillion'];
dataSource = new MatTableDataSource<CountryReports>(this.ELEMENT_DATA);

@ViewChild(MatSort, {static: true}) sort: MatSort;
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private service:JavatechieCovid19Service) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllReports();
  }

  public getAllReports(){
    let resp=this.service.covid19Reports();
    resp.subscribe(report=>this.dataSource.data=report as CountryReports[]);
  }

  applyFilter(filterValue: string) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
