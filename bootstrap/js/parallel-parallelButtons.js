/*
parallelButtons.js

Wessel de Jong
10206620

Programmeerproject
Prox data
*/

dataParallel(function(data){
    // console.log(data);

	// draw graphs
    parallellCoordinator(data, "floor1", "#parallel_1")
    parallellCoordinator(data, "floor2", "#parallel_2")
    parallellCoordinator(data, "floor3", "#parallel_3")
    //
    // // button functionality for skowing proximity data of floor 1
    // document.getElementById("button_parallel_1").onclick = function(){
    //
    //     for (i = 0; i < document.getElementsByClassName("parallels").length; i++){
    //         document.getElementsByClassName("parallels")[i].style.display = "none"
    //     };
    //

    d3.selectAll(".active").style("stroke", "steelblue");
    d3.selectAll(".foreground").select(".active").classed("active", false);

        // document.getElementById("table").style.display = "none";
    //
    //     document.getElementById("heatie").style.display = "none";
    //
    //     document.getElementById("parallel_1").style.display = "inline-block";
    // };
    //
    // // button functionality for skowing proximity data of floor 1
    // document.getElementById("button_parallel_2").onclick = function(){
    //
    //     for (i = 0; i < document.getElementsByClassName("parallels").length; i++){
    //         document.getElementsByClassName("parallels")[i].style.display = "none"
    //     };
    //
    //     document.getElementById("table").style.display = "none";
    //
    //     document.getElementById("heatie").style.display = "none";
    //
    //     document.getElementById("parallel_2").style.display = "block"
    // };
    //
    // // button functionality for skowing proximity data of floor 1
    // document.getElementById("button_parallel_3").onclick = function(){
    //
    //     for (i = 0; i < document.getElementsByClassName("parallels").length; i++){
    //         document.getElementsByClassName("parallels")[i].style.display = "none"
    //     };
    //
    //     document.getElementById("table").style.display = "none";
    //
    //     document.getElementById("heatie").style.display = "none";
    //
    //     document.getElementById("parallel_3").style.display = "block"
    // };
});
