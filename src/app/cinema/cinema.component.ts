import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CinemaService } from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css'],
})
export class CinemaComponent implements OnInit {
  public villes: any;
  public cinemas: any;
  public salles: any;
  public places: any;
  public currentVille: any;
  public currentCinema: any;
  public currentSeance: any;
  public currentProjection: any;
  public selectedTickets: any;

  constructor(public cinemaService: CinemaService) {
    this.cinemaService.getVilles().subscribe(
      (data) => {
        this.villes = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onGetCinemas(v: any) {
    this.currentVille = v;
    this.salles = undefined;
    this.cinemaService.getCinemas(v).subscribe(
      (data) => {
        this.cinemas = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onGetSalle(c: any) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c).subscribe(
      (data) => {
        this.salles = data;
        this.salles._embedded.salles.forEach((salle: any) => {
          this.cinemaService.getProjections(salle).subscribe(
            (data) => {
              salle.projections = data;
            },
            (err) => {
              console.log(err);
            }
          );
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onGetTicketsPlaces(p: any) {
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p).subscribe(
      (data) => {
        this.currentProjection.tickets = data;
        this.selectedTickets = [];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSelectTicket(ticket: any) {
    if (ticket.selected) {
      ticket.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(ticket), 1);
    } else {
      ticket.selected = true;
      this.selectedTickets.push(ticket);
    }
  }

  getTicketClass(ticket: any) {
    let classes: string = 'btn ';
    if (ticket.reserve) classes += 'btn-dark disabled ';
    else if (ticket.selected) classes += 'btn-primary ';
    else classes += 'btn-outline-secondary ';
    return classes;
  }

  onPayTickets(form: any) {
    let ticketsId: any[] = [];
    this.selectedTickets.forEach((ticket: any) => {
      ticketsId.push(ticket.id);
    });
    form.tickets = ticketsId;
    console.log(form);
    this.cinemaService.payerTickets(form).subscribe(
      (data: any) => {
        alert('Tickets reservées');
        this.onGetTicketsPlaces(this.currentProjection);
      },
      (err: any) => {
        alert('Erreur : ');
        console.log(err);
      }
    );
  }

  clearSelectedTickets(){
    this.selectedTickets.forEach((ticket: any) => {
      ticket.selected = false;
    });
    this.selectedTickets = [];
    this.onGetTicketsPlaces(this.currentProjection);
  }

  ngOnInit(): void {}
}
