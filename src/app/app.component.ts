import { Component, OnInit } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { error } from "console";
import { response } from "express";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit{
  title = "purificadora";
  response: any;
  readonly VAPID_PUBLIC_KEY =
    "BPqUE0OuQtFwPMDzFFttBK-aM3oJePkk_vsQ0OPmRQVJwWYQY1gq1U7mxFPRuSUR85rwBiU1ynfCsExlCIt40fk";

  constructor(private swPush: SwPush) {}
  ngOnInit(): void {
    this.subscription()
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  subscription() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((response) => {
        this.response = response;
       
      })
      .catch((error) => (
        this.response = error
      ));
    }
}
