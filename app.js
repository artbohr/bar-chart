const URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const margin = {top: 20, right: 20, bottom: 40, left: 50};
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const parseDate = d3.timeParse("%Y-%m-%d");
const yearMonth = d3.timeFormat("%b %Y");

//get json data
d3.json(URL).get((error,data)=>{
  if(error){
    console.log('data error');
  } else {

  const y = d3.scaleLinear()
              .domain(d3.extent(data.data, d => d[1]))
              .range([height, 0])
              .nice();

  const x = d3.scaleTime()
                .domain(d3.extent(data.data, d => parseDate(d[0])))
                .range([0, width]);

  const yAxis = d3.axisLeft(y);
  const xAxis = d3.axisBottom(x);

  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height+ margin.top + margin.bottom);
  const chartGroup = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");

  //draw bars
  chartGroup.selectAll("rect")
            .data(data.data)
            .enter().append("rect")
                  .attr("fill",'#8F5973')
                  .attr("height", d=> height - y(d[1]))
                  .attr("width",Math.ceil(width/data.data.length))
                  .attr("x",(d,i)=> { return x(parseDate(d[0])); })
                  .attr("y", d=> y(d[1]))
                    .on("mouseover", function() {
                      d3.select(this).style("fill", "#BDC2C6");
                      tooltip.style("visibility", "visible");
                      })
                    .on("mouseout", function() {
                      d3.select(this).style("fill", "#8F5973");
                      tooltip.style("visibility", "hidden");
                    })
                    .on("mousemove", function(d) {
                      tooltip.select("text").text(`GDP: $ ${d[1]} Billion
                         in ${yearMonth(new Date (d[0]))}`);
                    });

  let tooltip = chartGroup.append("g").attr("class","tooltip").style("visibility", "hidden");
  tooltip.append("text").attr("x","50").attr("y","30").style("font-size","20px").attr("font-weight","bold");

  chartGroup.append("g").attr("class","axis y").call(yAxis);
  chartGroup.append("g").attr("class", "axis x").attr("transform","translate(0,"+height+")").call(xAxis);
  }
});
