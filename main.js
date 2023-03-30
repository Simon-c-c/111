//main.js

async function DrawPolarClook() {


  var width = 580;
  var textS = '10px'
  if (width >= document.getElementById("cont").clientWidth * 0.8) { width = width; textS = '8px'}
    else if (width + 220 <= document.getElementById("cont").clientWidth * 0.8) { width = width + 200; textS = '10px'}
    else { width = document.getElementById("cont").clientWidth * 0.8; textS = '9px'}

  var height = width;
  var radius = width / 1.67;
  var armRadius = radius / 22;
  var dotRadius = armRadius - 9
  var color = d3.scaleSequential([0, 2 * Math.PI], d3.interpolateRainbow)
  

  let arcArm = d3.arc()
    .startAngle(d => armRadius / d.radius)
    .endAngle(d => -Math.PI - armRadius / d.radius)
    .innerRadius(d => d.radius - armRadius)
    .outerRadius(d => d.radius + armRadius)
    .cornerRadius(armRadius)

  var fields = [
    { radius: 0.2 * radius - 9, interval: d3.timeYear, subinterval: d3.timeMonth, format: d3.timeFormat("%b") },
    { radius: 0.3 * radius - 12, interval: d3.timeMonth, subinterval: d3.timeDay, format: d3.timeFormat("%d") },
    { radius: 0.4 * radius - 19, interval: d3.timeWeek, subinterval: d3.timeDay, format: d3.timeFormat("%a") },
    { radius: 0.6 * radius - 9, interval: d3.timeDay, subinterval: d3.timeHour, format: d3.timeFormat("%H") },
    { radius: 0.7 * radius - 9, interval: d3.timeHour, subinterval: d3.timeMinute, format: d3.timeFormat("%M") },
    { radius: 0.8 * radius - 9, interval: d3.timeMinute, subinterval: d3.timeSecond, format: d3.timeFormat("%S") }
  ]
  // var fields = [
  //     { radius: 0.8 * radius, interval: d3.timeMinute, subinterval: d3.timeSecond, format: d3.timeFormat("%S") },
  //     { radius: 0.7 * radius, interval: d3.timeHour, subinterval: d3.timeMinute, format: d3.timeFormat("%M") },
  //     { radius: 0.6 * radius, interval: d3.timeDay, subinterval: d3.timeHour, format: d3.timeFormat("%H") },
  //     { radius: 0.4 * radius, interval: d3.timeWeek, subinterval: d3.timeDay, format: d3.timeFormat("%a") },
  //     { radius: 0.3 * radius, interval: d3.timeMonth, subinterval: d3.timeDay, format: d3.timeFormat("%d") },
  //     { radius: 0.2 * radius, interval: d3.timeYear, subinterval: d3.timeMonth, format: d3.timeFormat("%b") }]

  //chart
  const svg = d3.select('#wrapper').append('svg')
    .attr('id','svg1')
    .attr("viewBox", [0, 0, width, height])
    .attr('height', height)
    .attr('width', width)
    .attr("text-anchor", "middle")
    .style("display", "block")
    .style("z-index", 1)
    .style("font", "500 14px var(--sans-serif)");
    
  svg.append("path")//内外大圈
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .attr('d',d3.arc()
      .innerRadius(width / 16)         
      .outerRadius(width / 4)
      .startAngle(-0.02)
      .endAngle(6.28))
    .attr('fill', '#aaaaaa')
    .style('filter', 'url(#inset-shadow)')

  svg.append("path")
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .attr('d',d3.arc()
      .innerRadius(0.6 * radius - 39)         
      .outerRadius(width/2)
      .startAngle(-0.02)
      .endAngle(6.28))
    .attr('fill', '#aaaaaa')
    .style('filter', 'url(#inset-shadow)')

  const field = svg.append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .selectAll("g")
    .data(fields)
    .join("g");

  // field.append('path')//每组数据一圈
  //   .attr('d',d3.arc()
  //     .innerRadius(d => d.radius-15)         
  //     .outerRadius(d => d.radius+15)
  //     .startAngle(-0.02)
  //     .endAngle(6.28))
  //   .attr('fill', '#aaaaaa')

  field.append("circle")
    .attr("fill", "none")
    .attr("stroke", "#CCD6DD")
    .attr("stroke-width", 1.5)
    .attr("r", d => d.radius);
  const fieldTick = field.selectAll("g")
    .data(d => {
      const date = d.interval(new Date(2000, 0, 1));
      d.range = d.subinterval.range(date, d.interval.offset(date, 1));
      return d.range.map(t => ({ time: t, field: d }));
    })
    .join("g")
    .attr("class", "field-tick")
    .attr("transform", (d, i) => {
      const angle = i / d.field.range.length * 2 * Math.PI - Math.PI / 2;
      return `translate(${Math.cos(angle) * d.field.radius},${Math.sin(angle) * d.field.radius})`;
    });
  const fieldCircle = fieldTick.append("circle")
    .attr("r", dotRadius)
    .style("color", (d, i) => color(i / d.field.range.length * 2 * Math.PI))
    //.style('fill', '#aaaaaa')
    .style("transition", "fill 500ms ease-out,transform 500ms ease");
  fieldTick.append("text")
    .attr("dy", "0.35em")
    .attr("fill", "#00000080")//#F5F5F1
    .style('font-size', textS)
    .text(d => d.field.format(d.time).slice(0, 2));

  const fieldFocus = field.append("circle")
    .attr("r", dotRadius + 1)
    .attr("fill", "none")
    .attr("stroke", "#494949b0")
    .attr("stroke-width", 3) 
    .attr("cy", d => -d.radius)
    .attr('class', 'razer')
    .style("transition", "transform 0ms ease");

  update(Math.floor((Date.now() + 1) / 1000) * 1000)

  // yield update(Math.floor((Date.now() + 1) / 1000) * 1000);

  // while (true) {
  //     const then = Math.ceil((Date.now() + 1) / 1000) * 1000;
  //     yield Promises.when(then, then).then(update);
  // } //yield无法在此情况运行，yield后面的function无法被识别。

  setInterval(function () { //每秒刷新一次图表
    //需要执行的代码写在function内
    update(Math.floor((Date.now() + 1) / 1000) * 1000)
  }, 1000);

  function update(then) {
    for (const d of fields) {
      const start = d.interval(then);
      const index = d.subinterval.count(start, then);
      d.cycle = (d.cycle || 0) + (index < d.index);
      d.index = index;
    }
    fieldCircle.attr("fill", (d, i) => i === d.field.index ? "#fff" : "#aaa")//#66757F
      .attr('filter', (d, i) => i === d.field.index ? 'url(#inset-shadow)' : '');
    fieldFocus.attr("transform", d => `rotate(${(d.index / d.range.length + d.cycle) * 360})`);
    return svg.node();
  }
console.log(width)
}
DrawPolarClook()

const debounce = (fn, delay) => {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, delay);
  }
};
const cancalDebounce = debounce(function(){
  d3.select('#svg1').remove();
  DrawPolarClook();
}, 500);

window.addEventListener('resize', cancalDebounce);