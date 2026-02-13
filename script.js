//Codes were taken from Plotly Reference Library on Plotly.com and USYD DECO3100 Tutorial Activities

// ===== INTERACTIVE ENHANCEMENTS =====

// Progress Bar
window.addEventListener('scroll', () => {
  const progressBar = document.getElementById('progressBar');
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.scrollY;
  const progress = (scrolled / documentHeight) * 100;
  progressBar.style.width = progress + '%';
});

// Scroll-triggered animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger counter animation if element has counter class
      if (entry.target.classList.contains('counter')) {
        animateCounter(entry.target);
      }

      // Check if any children have counters
      const counters = entry.target.querySelectorAll('.counter');
      counters.forEach(counter => {
        if (!counter.classList.contains('counted')) {
          animateCounter(counter);
        }
      });
    }
  });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
  // Observe fade-in elements
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up, .slide-in-left, .slide-in-right, .chart-container');
  fadeElements.forEach(el => animateOnScroll.observe(el));

  // Observe sections
  const sections = document.querySelectorAll('.fade-section');
  sections.forEach(section => animateOnScroll.observe(section));

  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Hide scroll indicator after scrolling
  let scrolled = false;
  window.addEventListener('scroll', () => {
    if (!scrolled) {
      scrolled = true;
      const indicator = document.querySelector('.scroll-indicator');
      if (indicator) {
        indicator.style.opacity = '0';
        setTimeout(() => {
          indicator.style.display = 'none';
        }, 500);
      }
    }
  });
});

// Animated Counter Function
function animateCounter(element) {
  if (element.classList.contains('counted')) return;

  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  element.classList.add('counted', 'counting');

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
      element.classList.remove('counting');
    }
  };

  updateCounter();
}

// Parallax effect for sections
window.addEventListener('scroll', () => {
  const parallaxSections = document.querySelectorAll('.parallax-section');
  parallaxSections.forEach(section => {
    const scrolled = window.pageYOffset;
    const coords = section.getBoundingClientRect().top + window.pageYOffset;
    const parallax = (scrolled - coords) * 0.3;
    section.style.backgroundPosition = `center ${parallax}px`;
  });
});

// Add loading animation to charts
const originalPlotlyNewPlot = Plotly.newPlot;
Plotly.newPlot = function(div, data, layout, config) {
  // Add loading class
  if (typeof div === 'string') {
    div = document.getElementById(div);
  }
  if (div) {
    div.classList.add('loading');
    div.style.minHeight = '400px';
  }

  // Call original function
  const result = originalPlotlyNewPlot.apply(this, arguments);

  // Remove loading class and add animation
  if (div) {
    setTimeout(() => {
      div.classList.remove('loading');
      div.style.animation = 'chartLoad 0.8s ease-out';
    }, 100);
  }

  return result;
};

// Enhanced hover effects for plotly charts
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const charts = document.querySelectorAll('.chart-container');
    charts.forEach(chart => {
      chart.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
      });
      chart.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });
  }, 2000);
});

//Linking csv files 
const TigPopDataSource = "tigerpopulation.csv";
const TrcPopDataSource = "trcpopulation.csv";
const TrcSeizuresDataSoruce = "tigerseizures.csv";
const ProsDataSoruce = "online.csv";
const TrcProDataSource = "TrcPro.csv";
const CaptiveDataSource = "captivetigers.csv";

//Calling divs from html
const TigPopPlot = document.getElementById("tigerpopulationgraph");
const TrcPopPlot = document.getElementById("TrcPopGraph");
const TrcChloropleth = document.getElementById("TrcChloropleth"); 
const TrcSeizures = document.getElementById("TrcSeizures");
const TrcSeizuresBar = document.getElementById("TrcSeizuresBar");
const ProsType = document.getElementById("OnlineListing");
const TrcPro = document.getElementById("TrcPro");
const Captive = document.getElementById("CaptiveGraph");


//function to load data from csv files
function loadTrcProData() {
  Plotly.d3.csv(TrcProDataSource, function (data){TrcProData(data)});
};

function loadTigPopData() {
    Plotly.d3.csv(TigPopDataSource, function (data){TigPopData(data)});
};

function loadTrcPopData() {
    Plotly.d3.csv(TrcPopDataSource, function (data){TrcPopData(data)});
};


function loadTrcSeizuresData() {
    Plotly.d3.csv(TrcSeizuresDataSoruce, function (data){TrcSeizuresData(data)});
};

function loadProsecutedData() {
    Plotly.d3.csv(ProsDataSoruce, function (data){ProsData(data)});
};

function loadCaptiveData() {
  Plotly.d3.csv(CaptiveDataSource, function (data){CaptiveData(data)});
};


//FUNCTIONS TO PUSH CSV ROWS OF DATA INTO ARRAY TO PARSE INTO GRAPH FUNCTIONS

function TigPopData(allRows) {
    // console.log(allRows);
    let x = [], y = []; //make variables to store the arrays needed to make the trace 

    for (let i = 0; i < allRows.length; i++) { //iterate over all rows of data
        let row = allRows[i];
        x.push(row['Year']);//push data into X
        y.push(row['Population']);//push data into Y
      }
      makeTigPopPlot(x, y);//pass X & Y array into function that makes graph
};

function TrcPopData(allRows) {
    // console.log(allRows);
    let x = [], y = []; //make variables to store the arrays needed to make the trace 

    for (let i = 0; i < allRows.length; i++) { //iterate over all rows of data
        let row = allRows[i];
        x.push(row['Count']);//push data into X
        y.push(row['Country']);//push data into Y
      }
      makeTrcChloroplethPlot(x,y);
};


function TrcSeizuresData(allRows) {
    // console.log(allRows);
    let x = [], y = []; //make variables to store the arrays needed to make the trace 

    for (let i = 0; i < allRows.length; i++) { //iterate over all rows of data
        let row = allRows[i];
        x.push(row['Country']);//push data into X
        y.push(row['Seizures']);//push data into Y
      }
      makeTrcSeizuresPlot(x, y);//pass X & Y array into function that makes graph
      makeTrcSeizuresBar(x,y);// both graphs use the same csv file
      
};

function ProsData(allRows) {
    // console.log(allRows);
    let x = [], y = []; //make variables to store the arrays needed to make the trace 

    for (let i = 0; i < allRows.length; i++) { //iterate over all rows of data
        let row = allRows[i];
        x.push(row['Country']);//push data into X
        y.push(row['Count']);//push data into Y
      }
      makeProsTypePlot(x, y);//pass X & Y array into function that makes graph
      
      
};

function CaptiveData(allRows) {
  // console.log(allRows);
  let x = [], y = []; z = []; //make variables to store the arrays needed to make the trace 

  for (let i = 0; i < allRows.length; i++) { //iterate over all rows of data
      let row = allRows[i];
      x.push(row['Country']);//push data into X
      y.push(row['CaptiveTigers']);//push data into Y
      z.push(row['NonCaptiveTigers'])//push data into Z
    }
    makeCaptivePlot(x, y, z);//pass X & Y & Z array into function that makes graph
    
    
};





//FUNCTION TO MAKE GRAPHS


//STACKED BAR GRAPH FOR CAPTIVE TIGERS
function makeCaptivePlot(x,y,z){
  //creating variables for bar traces
  let trace1 = {
      x: x,
      y: y,
      name: 'Captive Sources',
      type: 'bar',
      text: ['81% Captive', '67% Captive','49% Captive','33% Captive','44% Captive', '27% Captive','2% Captive'],
      textposition: 'auto',
      marker: {
        color: 'orange'
      },
        
      
    };
      

  let trace2 = 
      {
          x: x,
          y: z,
          name: 'Wild Sources',
          type: 'bar',
          textposition: 'auto',
          text: ['19% Wild', '33% Wild','51% Wild','67% Wild','56% Wild', '73% Wild','98% Wild'],
          marker: {
            color: 'grey'
          },
          
        };
      
//putting the traces into an array
var data = [trace1,trace2];

//setting up the layout of the graph
var layout = {title: {
              text: "Seized Tigers Suspected from Captive Sources",
              font:{
                color:'white'
              },
              standoff: 30
              },  xaxis: {
                title: {
                  text: 'TRC Countries',
                  font: {
                    size: 14,
                    color: 'white'
                  }
                },
                color:'white'
              },
              yaxis: {
                title: {
                  text: 'Count',
                  font: {      
                   size: 14,
                    color: 'white'
                  }
                },
                color:'white'
              },
              barmode: 'stack',
              paper_bgcolor: 'black',
              plot_bgcolor: 'black',
              width:1500,
              legend: {
                x: 1,
                y: 1,
                traceorder: 'normal',
                font: {
                  family: 'sans-serif',
                  size: 12,
                  color: '#000'
                },
                bgcolor: '#E2E2E2',
                bordercolor: '#FFFFFF',
                borderwidth: 2
              }
            };

//plotting the graph, calling the html element, trace arrays and layout
Plotly.newPlot(Captive, data, layout);

}


//tiger population line graph
function makeTigPopPlot(x,y){
    let traces = [
        {x: x,
         y: y,
         type: "scatter", 
         mode: "lines",  
         fill: 'tonexty',
         line: {
            color: 'orange'
        }
    }
    ]

    let layout ={
        title: {
            text: "Tiger Population in the past decades",
            standoff: 30
        },

        font:{
            size: 10,
            color: 'white'
        },
        width: 1200,
        height: 600,
        paper_bgcolor: 'black',
        plot_bgcolor: 'black',
        xaxis: {

            title: {
                text:"Years",
                font: {
                    color:"white",
                    size:15,
                }
            }
        }, 
        yaxis: {
            title: {
                text:"Population",
                font: {
                    color:"white",
                    size:15,
                }
            }
        },  
    };

    var config = {responsive: true}


    Plotly.newPlot(TigPopPlot, traces, layout, config);
}





//TRC Chloropleth Graph
function makeTrcChloroplethPlot(x,y){
    let traces = [
        {type: 'choropleth',
        locationmode: 'country names',
        locations: y,
        z: x,
        text: y,
        colorscale: [
          [0,'rgb(255, 239, 222)'],[0.05,'rgb(255, 213, 168)'],
          [0.15,'rgb(255, 164, 66)'], [1,'rgb(255, 85, 0)']],
        autocolorscale:false,
        marker: {
            line: {
            color: 'white',
            width: 0.8 }
            },
            colorbar: {
            title: 'Tiger Population' }
        }
        
    ]

    var layout = {
        title: 'Global Tiger Population amongst TRC Countries',
        font: {
            size: 13,
            color: 'white',
            family: 'Arial',
          },
        width: 1400,
        height: 700,
        paper_bgcolor: 'black',
        plot_bgcolor: 'black',
          geo:{
            showframe: false,
            showocean: true,
            oceancolor: 'black',
            fitbounds: "asia",
            showland: true,
            landcolor: '#161617',
        },
        
        

    }

    var config = { 
        scrollZoom: false,
    }


    Plotly.newPlot(TrcChloropleth, traces, layout, config);
}

//SCATTER GEO FOR SEIZURES
function makeTrcSeizuresPlot(x,y){
    var trace = [{
        type: 'scattergeo',
        locationmode:'country names',
        locations: x,
        text: y,
        marker: {
            size: y,
            sizemode: 'area',
            color: y,
            cmin: 0,
            cmax: 500,
            colorscale: 'Red',      
              line: {
              color: 'white',
              width: 1 },
            colorbar: {
                title: 'Seizures',
                ticksuffix: 'Count',
                showticksuffix: 'last'
            },

        },
        name: 'Seizures in TRC'
    }];
    
    var layout = {
        'geo': { 
            showframe: false,
            showocean: true,
            oceancolor: 'black',
            showland: true,
            landcolor: '#161617',
           

            
        },
        title: 'Tiger Seizures in TRC Countries',
        font: {

            size: 8,

          },
        width: 900,
        height: 600,
        paper_bgcolor: 'black',
        plot_bgcolor: 'black',
        
        

    }

        var config = { 
        scrollZoom: false,
    }


    Plotly.newPlot(TrcSeizures, trace, layout, config);
}

//BAR DISTRIBUTION FOR TIGER SEIZURES
function makeTrcSeizuresBar(x,y){
    let traces = [
        {x: y,
         y: x,
        type: 'bar',  
        orientation: 'h', 
        order: 'descending',
        marker:{
            color: ['#FF6200', '#FD7F2C', 
                    '#FD9346','#ffbb8a',
                    '#fcceac','#fad3b6', 
                    '#fce2cf','#ffecde',
                    '#faeee6','#fffbf7','#e6e3e1','#e6e3e1','#e6e3e1','#e6e3e1'
                      ]
          },
          text: ['Tigers Seized'] //For hover text on bar graph
        }
        
    ]

   var layout = {
    title:'Number of Tigers Seized in Each Country from 2000-2018',
    font: {
      size: 13,
      color: 'white',
      family: 'Arial'
    },
    width: 1400,
    height: 600,
    paper_bgcolor: 'black',
    plot_bgcolor: 'black',

    xaxis: {
        title: 'Seizures',            
        titlefont: {
        family: 'Arial',
        size: 16,
        color: 'white'
      }},
    yaxis: {
      autorange:'reversed',
      titlefont: {
        family: 'Arial',
        size: 16,
        color: 'white'
      },
      tickfont: {
        size: 13,
        color: 'white'
      }
    },
    
  };

    var config = {responsive: true}


    Plotly.newPlot(TrcSeizuresBar, traces, layout, config);
}





//PLOTTING PROSECUTION TYPE BAR GRAPH 
function makeProsTypePlot(x,y){
    let traces = [
        {x: y,
         y: x,
        type: 'bar',  
        orientation: 'h',
        order: 'ascending',
        //Setting the bar colors
        marker:{
            color: ['rgba(217, 217, 217,1)', 'rgba(217, 217, 217,0.8)', 
                    'rgba(217, 217, 217,1)', 'rgba(217, 217, 217,1)', 
                    'rgba(255, 166, 71,1)','rgba(255, 131, 0,1)',]
          },
          
        }
        
    ]
    //setting the layout of the graph
   var layout = {
    title:'Online Listings for Tiger Parts',
    font: {
      size: 13,
      color: 'white',
      family: 'Arial'
    },
    width: 900,
    height: 500,
    paper_bgcolor: 'black',
    plot_bgcolor: 'black',
      
    xaxis: {
        title: 'Count',            
        titlefont: {

        color: 'white'
      }},
    yaxis: {
      titlefont: {

        color: 'white'
      },
      tickfont: {
        size: 13,
        color: 'white'
      }
    },
    
  };

    var config = {responsive: true}


    Plotly.newPlot(ProsType, traces, layout, config);
}




//Calling of loadData functions

loadTrcProData();
loadTigPopData();
loadTrcPopData();
loadTrcSeizuresData();
loadProsecutedData();
loadCaptiveData();
