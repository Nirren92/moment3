
//konstanter och variabler
const data_lank = 'https://studenter.miun.se/~mallar/dt211g/';
const breaklineindex = 5;

var antagningsdata=null;

//DOM-event
window.onload =init_data();


window.addEventListener('beforeprint', () => {
    myChart.resize(600, 600);
  });
  window.addEventListener('afterprint', () => {
    myChart.resize();
  });
   


  function beforePrintHandler () {
    for (let id in Chart.instances) {
        Chart.instances[id].resize();
    }
}
 
 
async function init_data()
{

    try
    {
        
        antagningsdata= await get_data(data_lank);

        //skapar ett nytt objekt avorginaldata för att inte förstöra den. 
        var course_sorted = sort_and_biggest_first(JSON.parse(JSON.stringify(antagningsdata)),'applicantsTotal','Kurs',6);
        var program_sorted = sort_and_biggest_first(JSON.parse(JSON.stringify(antagningsdata)),'applicantsTotal','Program',5);
        
        console.log('hör',course_sorted);
        console.log('hör',program_sorted);

        chart_draw(course_sorted,'applicantsTotal','most_apply_course','Antal ansökande','bar');
        chart_draw(program_sorted,'applicantsTotal','most_apply_program','Antal ansökande','pie');
        
        

    }


    //Fångar upp eventuella fel som kan uppstå vid hämtning av data. 
    catch(error)
    {
        console.error('nåt gick fel',error);
    }


    
}


//delar upp label i lämpligt format för att klara av långa label string
function format_labels(input_array, size_string)
{
    var array_name = [];


    //går ignenom varje namn i array
    input_array.forEach(item => {

        var str_antal = 0;
        
        //splittar strängen till en tillfällig array per ord
        var str = item.name.split(" ");

        var temptext ="";

        var array_temp = [];

        //kollar varje string hur lång den är och bryter där input säger
        str.forEach(text => {
            
            str_antal=str_antal+text.length;
            temptext = temptext+" "+text;

            if(str_antal>size_string)
            {
                str_antal=0;
                array_temp.push(temptext);
                temptext = "";
                
            }

        });
       
        array_name.push(array_temp);
        array_temp = []; 
        item=temptext;
        
    });
    return array_name;
}


function chart_draw(input_array,filterord,canvasid,label_name,charttype)
{

   var array_name = format_labels(input_array,5);

    console.log('namnarray',array_name);


    const ctx = document.getElementById(canvasid);

    var manuellval = 0;

    //Sätter options beroende på vilen chart type
    if(charttype=='bar')
    {
        manuellval = {
        
            scales: {
                
                x: {
                    ticks: {
                        color:'black', 
                        
                        font: {
                            size: 15
                            
                        }
                    }
                },
                y: {
                    ticks: {
                        color:'black', 
                        
                        font: {
                            size: 18
                            
                        }
                    }
                }
            
            
                    
                
            },

            plugins: {
                legend: {
                    labels: {
                        color:'black', 
                        font: {
                            size: 10
                        }
                    }
                }
            }
        };

    }


    if(charttype=='pie')
    {
        manuellval = {
        
           

            plugins: {
                legend: {
                    labels: {
                        color:'black', 
                        font: {
                            size:10
                        }
                    }
                }
            }
        };

    }

    new Chart(ctx, {
      type: charttype,
      data: {

        labels: array_name,
        
        datasets: [{
          label: label_name,
          data: input_array.map(item => item[filterord]),
          borderWidth: 1
        }]
      },
      options:manuellval
    });
}




















// sorterar data i storleksordning baserat på det nyckelord som väljs i JSON string samt sorterat ut på ett valt ord
function sort_and_biggest_first(input_array,filterord,type_input,antal)
{

    input_array = input_array.filter(item => item.type.includes(type_input));

    console.log('filter',input_array)

    input_array = input_array.sort((a,b) => (b[filterord]-a[filterord]));

    return input_array.slice(0,antal);

}







//hämtar data asynkront baserat på input url
async function get_data(url_IN)
{
    
        const response = await fetch(url_IN);

        const data = await response.json();
        
        console.log("fetch",data)

        return data;

}