// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {
	var defaultAlpha = 0.5; //will be changes interactively
	var defaultBeta = 0.2;
	var defaultGamma = 0.7;
	var order1 = 1;
	var order2 = 1;
	var order3 = 1;
	var status = [0, 0, 0];
	const dispatchSingle = 'singleSelectionUpdated';
	const dispatchSingleParameter = 'changeSingleParameter'
	const dispatchString = 'selectionUpdated';
	const dispatchParameter = "changeParameter";
	const tableHeaders = ['node1','weight1','node2','weight2','node3','weight3','node4'];
	var rankings = [];
	d3.csv('data/data.csv', function(d) {
	return {
		node1: d.Node1,
		node2: d.Node2,
		node3: d.Node3,
		node4: d.Node4,
		weight1: d.Weight1,
		weight2: d.Weight2,
		weight3: d.Weight3,
		edge1: d.Node1+"-"+d.Node2,
		edge2: d.Node2+"-"+d.Node3,
		edge3: d.Node3+'-'+d.Node4
		};
	}).then(data =>{
		//console.log(data);
		//get the value of k
		var k = d3.select("#value-k").property("value");
		addTable(data,k);
		rankings[0] = table()
			.selectionDispatcher(d3.dispatch(dispatchString,dispatchParameter))
			('#table-div0', topData,rankings.length,tableHeaders,defaultAlpha,defaultBeta,defaultGamma);
		
		d3.select('#value-k')
		.on("change", function() {
			k = d3.select("#value-k").property("value");
			if (k >500) {
				k = 500;
				d3.select("#error-k-2").html("Maximum allowed k is 500.");
			}else {
				d3.select("#error-k-2").html("<br>");
			}
			updateK(data,k);
		});
		

		d3.select('#addFunctionButton')
		.on("click",function(){
			var id = addTable(data,k);
			rankings[id] = table()
			.selectionDispatcher(d3.dispatch(dispatchString,dispatchParameter))
			('#table-div'+id, topData,rankings.length,tableHeaders,defaultAlpha,defaultBeta,defaultGamma);
			dispatch();
			if(findEmptyRanking() == -1)
			{
				d3.select('#addFunctionButton')
				.text("All three functions used")
				.style("background","red")
				.attr('disabled',true);
			}
		});

		var singlek = d3.select("#single-value-k").property("value");
		addSingleTable(data,singlek);
	
	    d3.select('#single-value-k')
		.on("change", function() {
			singlek = d3.select("#single-value-k").property("value");
			if (singlek >500) {
				singlek = 500;
				d3.select("#error-k").html("Maximum allowed k is 500.");
			}else {
				d3.select("#error-k").html("<br>");
			}
			updateSingleK(data,singlek); //also updates scatter plot
		});

		d3.select('#single-order-selection')
		.on("change", function() {
			singlek = d3.select("#single-value-k").property("value");
			updateSingleK(data,singlek); //also updates scatter plot
		});

		d3.selectAll('input[name="node-scatterplot"]')
		  .on('change', function() {
		  	singlek = d3.select("#single-value-k").property("value");
			updateSingleK(data,singlek);
		});
	})

	//add Scatter Plot

	function addScatterPlot(data,singleTable){
		// Create a scatterplot given x and y attributes, labels, offsets; 
	    // a dispatcher (d3-dispatch) for selection events; 
	    // a div id selector to put our svg in; and the data to use.
	    let singlek = d3.select("#single-value-k").property("value");
	    let order = d3.select('#single-order-selection').property("value");
	    let currentNode = d3.select('input[name="node-scatterplot"]:checked').node().value;
	    //console.log(currentNode);
	    //console.log(data);
	    if (currentNode == 1){
		    var singleScatterplot = scatterplot()
		      .x(data => data.weight1) //need to change to edge weight
		      .xLabel('Edge1 weight (from node1 to node 2)')
		      .y(data =>data.weight) //need to change to the frequency of each edges
		      .yLabel('Total Weight') //Have to change to the frequency of the edges in the top ranking
		      .yLabelOffset(40)
		      .selectionDispatcher(d3.dispatch(dispatchSingle))
		      ('#scatterplot', data, order); 
		      
		}else if (currentNode == 2) {
		  	var singleScatterplot = scatterplot()
		      .x(data => data.weight2) //need to change to edge weight
		      .xLabel('Edge2 weight (from node2 to node 3)')
		      .y(data =>data.weight) //need to change to the frequency of each edges
		      .yLabel('Total Weight') //Have to change to the frequency of the edges in the top ranking
		      .yLabelOffset(40)
		      .selectionDispatcher(d3.dispatch(dispatchSingle))
		      ('#scatterplot', data, order);
		} else { //node ==3 
			var singleScatterplot = scatterplot()
		      .x(data => data.weight3) //need to change to edge weight
		      .xLabel('Edge3 weight (from node3 to node 4)')
		      .y(data =>data.weight) //need to change to the frequency of each edges
		      .yLabel('Total Weight') //Have to change to the frequency of the edges in the top ranking
		      .yLabelOffset(40)
		      .selectionDispatcher(d3.dispatch(dispatchSingle))
		      ('#scatterplot', data, order);
		} 
	    
	    singleScatterplot.selectionDispatcher().on(dispatchSingle.concat(".sp-to-tab"),singleTable.updateSelection);
	    singleTable.selectionDispatcher().on(dispatchSingle.concat(".sp-to-tab"),singleScatterplot.updateSelection);

	}
	//add new table for new comparison function
	function addSingleTable(data,singlek){
		let singleOrder = d3.select('#single-order-selection').property("value");
		if (singleOrder == "asc"){
			//var singleTopData = data.slice(0, singlek).sort((a, b) => d3.ascending((defaultAlpha * Math.pow(a.weight1,order1) + defaultBeta * Math.pow(a.weight2,order2) + defaultGamma * Math.pow(a.weight3,order3)).toFixed(2), (defaultAlpha * Math.pow(b.weight1,order1) + defaultBeta * Math.pow(b.weight2,order2) + defaultGamma * Math.pow(b.weight3,order3)).toFixed(2)));
			var singleTopData = data.sort(function(a, b){
				a.weight = (defaultAlpha * Math.pow(a.weight1,+order1) + defaultBeta * Math.pow(a.weight2,+order2) + defaultGamma * Math.pow(a.weight3,+order3)).toFixed(2);
				b.weight = (defaultAlpha * Math.pow(b.weight1,+order1) + defaultBeta * Math.pow(b.weight2,+order2) + defaultGamma * Math.pow(b.weight3,+order3)).toFixed(2);
				//console.log(b.weight - a.weight);
				return a.weight - b.weight}).slice(0,singlek);
		}else{
			//var singleTopData = data.slice(0, singlek).sort((a, b) => d3.descending((defaultAlpha * Math.pow(a.weight1,order1) + defaultBeta * Math.pow(a.weight2,order2) + defaultGamma * Math.pow(a.weight3,order3)).toFixed(2), (defaultAlpha * Math.pow(b.weight1,order1) + defaultBeta * Math.pow(b.weight2,order2) + defaultGamma * Math.pow(b.weight3,order3)).toFixed(2)));
			
			var singleTopData = data.sort(function(a, b){
				a.weight = (defaultAlpha * Math.pow(a.weight1,order1) + defaultBeta * Math.pow(a.weight2,order2) + defaultGamma * Math.pow(a.weight3,order3)).toFixed(2);
				b.weight = (defaultAlpha * Math.pow(b.weight1,order1) + defaultBeta * Math.pow(b.weight2,order2) + defaultGamma * Math.pow(b.weight3,order3)).toFixed(2);
				//console.log(b.weight - a.weight);
				return (+b.weight) - (+a.weight)}).slice(0,singlek);
		}
		
		//console.log(topData);
		//these are the static parts we need on each table. So, we coded them in visualization.js instead of table.js.
		let tableDiv = d3.select('#single-table-div')
		  .attr("class","single-ranking")
		  .attr("height",'300px')
		  .attr('preserveAspectRatio', 'xMidYMid meet');
		//add slider for alpha
		tableDiv.append("span")
			.html("&alpha;")
			.style('user-select','none');
		tableDiv
			.append("input")
				.attr('type',"range")
				.attr("min","0")
				.attr("max","1")
				.attr("title",defaultAlpha)
				.attr("step","0.1")
				.attr("value",defaultAlpha)
				.attr("id","single-alpha")
				.attr("class","slider single-para");
		//add slider for beta
		tableDiv.append("span")
			.html("&beta;")
			.style('user-select','none');
		let beta = tableDiv
			.append("input")
				.attr('type',"range")
				.attr("min","0")
				.attr("max","1")
				.attr("step","0.1")
				.attr("value",defaultBeta)
				.attr("title",defaultBeta)
				.attr("id","single-beta")
				.attr("class","slider single-para");
		//add slider for gamma
		tableDiv.append("span")
			.html("&gamma;")
			.style('user-select','none');
		tableDiv
			.append("input")
				.attr('type',"range")
				.attr("min","0")
				.attr("max","1")
				.attr("step","0.1")
				.attr("title",defaultGamma)
				.attr("value",defaultGamma)
				.attr("id","single-gamma")
				.attr("class","slider single-para");

		//adding change events
		d3.selectAll(".single-para")
		.on("change",function() {
			singlek = d3.select("#single-value-k").property("value");
			updateSingleParameter(data,singlek); //
		});
	var singleTable = singletable()
			.selectionDispatcher(d3.dispatch(dispatchSingle,dispatchSingleParameter))
			('#single-table-div', singleTopData,tableHeaders,defaultAlpha,defaultBeta,defaultGamma,singleOrder);
	addScatterPlot(singleTopData,singleTable);
	}

	//update the tables for change in parameters
	function updateSingleParameter(data, singlek){
		let singleOrder = d3.select('#single-order-selection').property("value");
		//dconsole.log(singleOrder);
		let alphaVal = d3.select("#single-alpha").property("value");
		let betaVal = d3.select("#single-beta").property("value");
		let gammaVal = d3.select("#single-gamma").property("value");
		if(singleOrder == "asc"){
			singleTopData = data.sort(function(a, b){
			a.weight = (alphaVal * Math.pow(a.weight1,order1) + betaVal * Math.pow(a.weight2,order2) + gammaVal * Math.pow(a.weight3,order3)).toFixed(2);
			b.weight = (alphaVal * Math.pow(b.weight1,order1) + betaVal * Math.pow(b.weight2,order2) + gammaVal * Math.pow(b.weight3,order3)).toFixed(2);
			//console.log(b.weight - a.weight);
			return a.weight - b.weight}).slice(0,singlek);
		} else {
			singleTopData = data.sort(function(a, b){
			a.weight = (alphaVal * Math.pow(a.weight1,order1) + betaVal * Math.pow(a.weight2,order2) + gammaVal * Math.pow(a.weight3,order3)).toFixed(2);
			b.weight = (alphaVal * Math.pow(b.weight1,order1) + betaVal * Math.pow(b.weight2,order2) + gammaVal * Math.pow(b.weight3,order3)).toFixed(2);
			//console.log(b.weight - a.weight);
			return b.weight - a.weight}).slice(0,singlek);
		}
		d3.select("#single-table-div").selectAll(".table").remove();
		d3.select('#single-table-div').selectAll(".equation").remove();
		var singleTable = singletable()
				.selectionDispatcher(d3.dispatch(dispatchSingle))
				('#single-table-div',singleTopData, tableHeaders,alphaVal,betaVal,gammaVal, singleOrder);
		d3.select("#scatterplot").selectAll(".vis-svg").remove();
		addScatterPlot(singleTopData, singleTable);
		//dispatch();
	}
	
	//update the single table for change in the value of k.
	function updateSingleK(data,singlek){
		let singleOrder = d3.select('#single-order-selection').property("value");
		alphaVal = d3.select("#single-alpha").property("value");
		betaVal = d3.select("#single-beta").property("value");
		gammaVal = d3.select("#single-gamma").property("value");
			
		if (singleOrder == "asc") {
			singleTopData = data.sort(function(a,b){
			a.weight = (alphaVal * Math.pow(a.weight1,order1) + betaVal * Math.pow(a.weight2,order2) + gammaVal * Math.pow(a.weight3,order3)).toFixed(2);
			b.weight = (alphaVal * Math.pow(b.weight1,order1) + betaVal * Math.pow(b.weight2,order2) + gammaVal * Math.pow(b.weight3,order3)).toFixed(2);
			//console.log(b.weight - a.weight);
			return a.weight - b.weight}).slice(0,singlek);
		} else {
			singleTopData = data.sort(function(a,b){
			a.weight = (alphaVal * Math.pow(a.weight1,order1) + betaVal * Math.pow(a.weight2,order2) + gammaVal * Math.pow(a.weight3,order3)).toFixed(2);
			b.weight = (alphaVal * Math.pow(b.weight1,order1) + betaVal * Math.pow(b.weight2,order2) + gammaVal * Math.pow(b.weight3,order3)).toFixed(2);
			//console.log(b.weight - a.weight);
			return b.weight - a.weight}).slice(0,singlek);
		}
		//console.log(singlek);
		d3.select('#single-table-div').selectAll(".table").remove();
		d3.select('#single-table-div').selectAll(".equation").remove();
		var singleTable = singletable()
			.selectionDispatcher(d3.dispatch(dispatchSingle))
			('#single-table-div', singleTopData,tableHeaders,alphaVal,betaVal,gammaVal, singleOrder);
		d3.select("#scatterplot").selectAll(".vis-svg").remove();
		addScatterPlot(singleTopData,singleTable);
		//dispatch();
	}

	//add new table for new comparison function
	function addTable(data,k){
		topData = data.sort(function(a, b){
			a.weight = (defaultAlpha * Math.pow(a.weight1,order1) + defaultBeta * Math.pow(a.weight2,order2) + defaultGamma * Math.pow(a.weight3,order3)).toFixed(2);
			b.weight = (defaultAlpha * Math.pow(b.weight1,order1) + defaultBeta * Math.pow(b.weight2,order2) + defaultGamma * Math.pow(b.weight3,order3)).toFixed(2);
			//console.log(b.weight - a.weight);
			return b.weight - a.weight}).slice(0,k);

		//these are the static parts we need on each table. So, we coded them in visualization.js instead of table.js.
		var id = findEmptyRanking();
		status[id] = 1;
		let tableDiv = d3.select('#table-div'+id)
		  .attr("class","ranking")
		  .attr('preserveAspectRatio', 'xMidYMid meet');
		tableDiv.append("span").html("Ranking " + (id + 1)).style("text-align","center").style('user-select','none');
		tableDiv.append("button").html("Delete")
		  .attr("class","deleteButton");
		tableDiv.append("br");
		//add slider for alpha
		tableDiv.append("span")
			.html("&alpha;").style('user-select','none');
		tableDiv
			.append("input")
				.attr('type',"range")
				.attr("min","0")
				.attr("max","1")
				.attr("title",defaultAlpha)
				.attr("step","0.1")
				.attr("value",defaultAlpha)
				.attr("id","alpha-"+id)
				.attr("class","slider para-"+id);
		//add slider for beta
		tableDiv.append("span")
			.html("&beta;").style('user-select','none');
		let beta = tableDiv
			.append("input")
				.attr('type',"range")
				.attr("min","0")
				.attr("max","1")
				.attr("step","0.1")
				.attr("value",defaultBeta)
				.attr("title",defaultBeta)
				.attr("id","beta-"+id)
				.attr("class","slider para-"+id);
		//add slider for gamma
		tableDiv.append("span")
			.html("&gamma;").style('user-select','none');
		tableDiv
			.append("input")
				.attr('type',"range")
				.attr("min","0")
				.attr("max","1")
				.attr("step","0.1")
				.attr("title",defaultGamma)
				.attr("value",defaultGamma)
				.attr("id","gamma-"+id)
				.attr("class","slider para-"+id);

		//adding change events
		d3.selectAll(".para-"+id)
		.on("change",function() {
			id = d3.select(this).attr("id");
			id = id[id.length-1];
			k = d3.select("#value-k").property("value");
			updateParameter(data,id,k); //
		});
		
		// Deletion event
		d3.selectAll('.deleteButton')
		.on("click",function(event){
			status[parseInt(event.currentTarget.parentElement.id.charAt(9))] = 0;
			d3.select(event.currentTarget.parentElement).html("");
			d3.select('#addFunctionButton')
				.text("Create a new ranking")
				.style("background","dodgerblue")
				.attr('disabled',null);
		});
		
		return id;
	}
	
	//update the existing table for change in the value of k.
	function updateK(data,k){
		for (let i =0; i < rankings.length; i++){
			topData = data.sort(function(a,b){
				alphaVal = d3.select("#alpha-"+i).property("value");
				betaVal = d3.select("#beta-"+i).property("value");
				gammaVal = d3.select("#gamma-"+i).property("value");
				a.weight = (alphaVal * Math.pow(a.weight1,order1) + betaVal * Math.pow(a.weight2,order2) + gammaVal * Math.pow(a.weight3,order3)).toFixed(2);
				b.weight = (alphaVal * Math.pow(b.weight1,order1) + betaVal * Math.pow(b.weight2,order2) + gammaVal * Math.pow(b.weight3,order3)).toFixed(2);
				//console.log(b.weight - a.weight);
				return b.weight - a.weight}).slice(0,k);
			d3.select('#table-div'+i).selectAll(".table").remove();
			d3.select('#table-div'+i).selectAll(".equation").remove();
			if (status[i] == 1) {
				rankings[i] = table()
					.selectionDispatcher(d3.dispatch(dispatchString))
					('#table-div'+i, topData, i, tableHeaders,alphaVal,betaVal,gammaVal);
			}
			dispatch();
		}
	}

	//update the tables for change in parameters
	function updateParameter(data, id, k){
		let alphaVal = d3.select("#alpha-"+id).property("value");
		let betaVal = d3.select("#beta-"+id).property("value");
		let gammaVal = d3.select("#gamma-"+id).property("value");
		topData = data.sort(function(a, b){
			a.weight = (alphaVal * Math.pow(a.weight1,order1) + betaVal * Math.pow(a.weight2,order2) + gammaVal * Math.pow(a.weight3,order3)).toFixed(2);
			b.weight = (alphaVal * Math.pow(b.weight1,order1) + betaVal * Math.pow(b.weight2,order2) + gammaVal * Math.pow(b.weight3,order3)).toFixed(2);
			//console.log(b.weight - a.weight);
			return b.weight - a.weight}).slice(0,k);
		d3.select("#table-div"+id).selectAll(".table").remove();
		d3.select('#table-div'+id).selectAll(".equation").remove();
		rankings[id] = table()
				.selectionDispatcher(d3.dispatch(dispatchString))
				('#table-div'+id, topData, id, tableHeaders,alphaVal,betaVal,gammaVal);
		dispatch();
	}
	
	// Link each ranking
	function dispatch() {
		for (i = 0; i < rankings.length; i++) {
			for (j = i + 1; j < rankings.length; j++) {
				rankings[i].selectionDispatcher().on(dispatchString + "." + j, rankings[j].updateSelection);
				rankings[j].selectionDispatcher().on(dispatchString + "." + i, rankings[i].updateSelection);
			}
		}
	}
	
	// Find an empty place to create the new ranking
	function findEmptyRanking() {
		if (status[0] == 0) {
			return 0;
		} else if (status[1] == 0) {
			return 1;
		} else if (status[2] == 0) {
			return 2;
		} else {
			return -1;
		}
	}
})());