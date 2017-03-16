import './assets/scss/final.scss'; // Main .scss file (triggers sass-loader)
import { person } from "./person";
import { select } from "d3-selection";
import { SubNavController } from "./controller/SubNavController";

jQuery(document).ready(function () {
    select("#content").append("h4").text(person.firstName + ' ' + person.lastName + ' is using jQuery version ' + jQuery().jquery);
    var c = new SubNavController();
    
});

