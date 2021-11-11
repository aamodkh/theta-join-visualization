/* global D3 */

// draw table. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function singletable() {

	let margin = {
      top: 60,
      left: 5,
      right: 5,
      bottom: 35
    },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    selectableElements = d3.select(null),dispatcher;
    //function to create the table. Arguments are selection id, data, table ID and the columns of the table.
	function chart(selector, data, columns,alphaReceived,betaReceived,gammaReceived, order){
		let tableDiv = d3.select(selector)
		  .attr('preserveAspectRatio', 'xMidYMid meet'); 
		
		let alphaSign = "";

		if(betaReceived<0){
			betaSign = "";
		}else{
			betaSign = "+";
		}

		if(gammaReceived<0){
			gammaSign = "";
		}else{
			gammaSign = "+";
		}
		let equation = "<br>f(x,y,z)= "+alphaSign+alphaReceived+"x"+betaSign+betaReceived+"y"+gammaSign+gammaReceived+"z";

		tableDiv.append('span')
			.attr("class","equation")
		    .html(equation);
        let table = tableDiv.append("table")
          .attr("id","single-table-number")
		  //.attr('width',width+ margin.left + margin.right)
		  .attr('height',height+ margin.top + margin.bottom)
		  .attr("class", "table text-unselectable"),
		  thead = table.append("thead"),
		  tbody = table.append("tbody");

		let headers = thead.append('tr');

		headers.attr("class",'thead')
		    .selectAll('th')
		    .attr('title','A is important')
		    .data(columns).enter()
		    .append('th')
		    .style("width",'60px')
		    .text(function (col) {
				return col;
			});
		headers.append('th').style('display','block').style('width','80px');
		// Remove the weight titles. Note that odd columns are nodes while even columns are weights.
		thead.selectAll('th:nth-child(even)').text(function(d, i){return "";});
	    // create a row for each object in the data
	    let rows = tbody.selectAll('tr')
	      .data(data)
	      .enter()
	      .append('tr');
		
		let weight1 = [];
		let weight2 = [];
		let weight3 = [];
		let k = 0;
		
	    // create a cell in each row for each column
	    let cells = rows.selectAll('td')
	      .data(function (row) {
	        return columns.map(function (col) {
	          return {col: col, value: row[col]};
	        });
	      })
	      .enter()
	      .append('td')
	      .style("width","30px")
	        .text(function (d, i) { 
			// D3 somehow doesn't allow us to directly use the input data. If we directly access data, we can't draw ranking2&3.
			// Therefore, we store the weight data into arrays and read from these arrays when these weights are required.
			if (i == 1){
				weight1[k] = d.value;
			} else if (i == 3){
				weight2[k] = d.value;
			} else if (i == 5){
				weight3[k] = d.value;
				k++;
			}
			return d.value; });

		rows.selectAll('td:nth-child(even)').text(function(d, i){return "";}).append('div').attr("class","tooltip");;
		rows.selectAll('td:nth-child(even)').append('hr');
		rows.append('td').attr('class','details').style("width","80px");
		for (i = 0; i < k; i++){
			if (order == "asc"){
				hue = 360; // Red for ascending
			} else {
				hue = 240; // Blue for descending
			}

			tbody.select('tr:nth-child(' + (i+1) + ')').selectAll('td:nth-child(2)').select('hr').style("height",weight1[i] * 1.5 + "px");
			tbody.select('tr:nth-child(' + (i+1) + ')').selectAll('td:nth-child(4)').select('hr').style("height",weight2[i] * 1.5 + "px");
			tbody.select('tr:nth-child(' + (i+1) + ')').selectAll('td:nth-child(6)').select('hr').style("height",weight3[i] * 1.5 + "px");
		}
		
		rows.select('td:nth-child(2)').select('hr').style("background","hsl("+ hue + ", 100%," + ((1 - alphaReceived) * 80 + 20) + "%)");
		rows.select('td:nth-child(4)').select('hr').style("background","hsl("+ hue + ", 100%," + ((1 - betaReceived) * 80 + 20) + "%)");
		rows.select('td:nth-child(6)').select('hr').style("background","hsl("+ hue + ", 100%," + ((1 - gammaReceived) * 80 + 20) + "%)");
		



		selectableElements = rows; //as we want to select rows.
	    
		// Use mousedown, mousemove and mouseup together to implement brush
		var mousedown = -1;
		rows.on('mouseover', (event, d) => {
			currentRow = d3.select(event.currentTarget).classed('mouseover', true);
			currentRow.select('td:nth-child(8)').text(d.weight);
			currentRow.select('td:nth-child(2)').select('div').text((d.weight1 * alphaReceived).toFixed(2));
			currentRow.select('td:nth-child(4)').select('div').text((d.weight2 * betaReceived).toFixed(2));
			currentRow.select('td:nth-child(6)').select('div').text((d.weight3 * gammaReceived).toFixed(2));
		}).on('mouseout', (event, d) => {
			currentRow = d3.select(event.currentTarget).classed('mouseover', false);
			currentRow.select('td:nth-child(8)').text('');
			currentRow.select('td:nth-child(2)').select('div').text('');
			currentRow.select('td:nth-child(4)').select('div').text('');
			currentRow.select('td:nth-child(6)').select('div').text('');
		}).on('mousedown', (event, d) => {
			mousedown = event.currentTarget.rowIndex;
			d3.selectAll('.selected').classed('selected', false);
			d3.select(event.currentTarget).classed('selected', true);
			// Get the name of our dispatcher's event
			let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
			// Let other charts know about our selection
			dispatcher.call(dispatchString, this, d3.selectAll('.selected').data());
		}).on('mousemove', (event, d) => {
			if (mousedown != -1){d3.select(event.currentTarget).classed('selected', true);}
			// Get the name of our dispatcher's event
			let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
			//console.log(dispatchString);
			// Let other charts know about our selection
			dispatcher.call(dispatchString, this, d3.selectAll('.selected').data());
		}).on('mouseup', (event, d) => {
			// In case the mouse is moving so fast that mousemove is not able to catch the event
			if (mousedown >= event.currentTarget.rowIndex) {
				for (i = event.currentTarget.rowIndex; i <= mousedown; i++) {
					tbody.select('tr:nth-child(' + i + ')').classed('selected', true);
				}
			} else {
				for (i = mousedown; i <= event.currentTarget.rowIndex; i++) {
					tbody.select('tr:nth-child(' + i + ')').classed('selected', true);
				}
			}
			mousedown = -1;
		});
		
		rows.selectAll('td:nth-child(2)').on('dblclick', (event, d) => {
			rows.classed('selected', false);
			d3.select(event.currentTarget).classed('selected', true);
			d3.select(event.currentTarget.parentElement).select('td:nth-child(1)').classed('selected', true);
			d3.select(event.currentTarget.parentElement).select('td:nth-child(3)').classed('selected', true);
			currentEdge = d.edge1;
			rows.filter(function(d) { return d.edge1 == currentEdge}).select('td:nth-child(1)').classed('selected', true);
			rows.filter(function(d) { return d.edge1 == currentEdge}).select('td:nth-child(2)').classed('selected', true);
			rows.filter(function(d) { return d.edge1 == currentEdge}).select('td:nth-child(3)').classed('selected', true);
		});
		rows.selectAll('td:nth-child(4)').on('dblclick', (event, d) => {
			rows.classed('selected', false);
			d3.select(event.currentTarget).classed('selected', true);
			d3.select(event.currentTarget.parentElement).select('td:nth-child(3)').classed('selected', true);
			d3.select(event.currentTarget.parentElement).select('td:nth-child(5)').classed('selected', true);
			currentEdge = d.edge2;
			rows.filter(function(d) { return d.edge2 == currentEdge}).select('td:nth-child(3)').classed('selected', true);
			rows.filter(function(d) { return d.edge2 == currentEdge}).select('td:nth-child(4)').classed('selected', true);
			rows.filter(function(d) { return d.edge2 == currentEdge}).select('td:nth-child(5)').classed('selected', true);
		});
		rows.selectAll('td:nth-child(6)').on('dblclick', (event, d) => {
			rows.classed('selected', false);
			d3.select(event.currentTarget).classed('selected', true);
			d3.select(event.currentTarget.parentElement).select('td:nth-child(5)').classed('selected', true);
			d3.select(event.currentTarget.parentElement).select('td:nth-child(7)').classed('selected', true);
			currentEdge = d.edge3;
			rows.filter(function(d) { return d.edge3 == currentEdge}).select('td:nth-child(5)').classed('selected', true);
			rows.filter(function(d) { return d.edge3 == currentEdge}).select('td:nth-child(6)').classed('selected', true);
			rows.filter(function(d) { return d.edge3 == currentEdge}).select('td:nth-child(7)').classed('selected', true);
		});
		return chart;
	}

	// Gets or sets the dispatcher we use for selection events
	chart.selectionDispatcher = function (_) {
	    if (!arguments.length) return dispatcher;
	    dispatcher = _;
	    return chart;
	};

	chart.updateSelection = function (selectedData) {
	    if (!arguments.length) return;
	    // Select an element if its datum was selected
	    selectableElements.classed('selected', d =>
	      selectedData.includes(d)
	    );
	};
	return chart;
}