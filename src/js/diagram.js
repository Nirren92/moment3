
//konstanter och variabler
const data_lank = 'https://studenter.miun.se/~mallar/dt211g/';



//DOM-event
window.onload =init_data();



var antagningsdata=null;
 
async function init_data()
{

    try
    {
        
        antagningsdata= await get_data(data_lank);

        //skapar ett nytt objekt avorginaldata för att inte förstöra den. 
        var course_sorted = sort_and_biggest_first(JSON.parse(JSON.stringify(antagningsdata)),'applicantsTotal','Kurs');
        var program_sorted = sort_and_biggest_first(JSON.parse(JSON.stringify(antagningsdata)),'applicantsTotal','Program');
        
        console.log('hör',course_sorted);
        console.log('hör',program_sorted);

        chart_draw(course_sorted,'applicantsTotal','most_apply_course');
        chart_draw(program_sorted,'applicantsTotal','most_apply_program');
        
        

    }


    //Fångar upp eventuella fel som kan uppstå vid hämtning av data. 
    catch(error)
    {
        console.error('nåt gick fel',error);
    }


    
}






function chart_draw(input_array,filterord,canvasid)
{
    const ctx = document.getElementById(canvasid);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [input_array[0].name, input_array[1].name, input_array[2].name,input_array[3].name,input_array[4].name,input_array[5].name],
        datasets: [{
          label: '# of Votes',
          data: [input_array[0][filterord],input_array[1][filterord],input_array[2][filterord],input_array[3][filterord],input_array[4][filterord],input_array[5][filterord]],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
}




















// sorterar data i storleksordning baserat på det nyckelord som väljs i JSON string samt sorterat ut på ett valt ord
function sort_and_biggest_first(input_array,filterord,type_input)
{

    input_array = input_array.filter(item => item.type.includes(type_input));

    console.log('filter',input_array)

    input_array = input_array.sort((a,b) => (b[filterord]-a[filterord]));

    return input_array.slice(0,6);

}







//hämtar data asynkront baserat på input url
async function get_data(url_IN)
{
    
        const response = await fetch(url_IN);

        const data = await response.json();
        
        console.log("fetch",data)

        return data;

}