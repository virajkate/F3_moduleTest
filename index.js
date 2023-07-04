const getButton= document.getElementById("get_data");
const container= document.getElementById("main-container");
const showData= document.getElementById("alldata");

let IP="";
const token="fb5478499a4aea";
// const key="AIzaSyDoUICPU6WvV_vcwYY45eqY9fJCTJTuxS4";

$.getJSON("https://api.ipify.org?format=json", function(data) {
        IP=data.ip;
    })

getButton.addEventListener("click",getDetails);

 async function getDetails(){

    getButton.style.display="none"
    showData.style.display="inline";

    // const url= `https://ipinfo.io/${IP}/geo`;
    const url= `https://ipinfo.io/${IP}?token=${token}`;
    try{
    let response= await fetch(url);
    let result=await response.json();

    fetchData(result);

    // console.log(result)
    } catch(error){
        // console.trace(error);
        alert("Something went wrong")
    }
}


 async function fetchData(result){
        let coordinates=result.loc.split(",");
        let lat=coordinates[0];
        let long=coordinates[1];

        const heading_info= document.createElement("div");
        heading_info.className="heading_info";
        heading_info.innerHTML=`
        <div class="info">
                <span class="details">Lat:  ${lat}</span>
                <span class="details">Long:  ${long}</span>
            </div>
                <div class="info">
                    <span class="datails">City:  ${result.city}</span>
                    <span class="details">Region:  ${result.region}</span>
                </div>
            <div class="info">
                <span class="details">Organisation:  ${result.org}</span>
                <span class="details">Hostname:  ${result.ip}</span>
            </div>
        `
        showData.append(heading_info);

        const location_map= document.createElement("div");
        location_map.className="map";
        location_map.innerHTML=`
        <iframe width="100% " height="550" frameborder="0" style="border:0"
            src="https://maps.google.com/maps?q=${lat},${long}&output=embed"></iframe>
        `
        showData.append(location_map)

        let pin= result.postal

        const url=`https://api.postalpincode.in/pincode/${pin}`;

    
            let output=await  fetch(url);
            let list= await output.json();


        const footer_info= document.createElement("div")
        footer_info.className="footer_info";
        let ts = 1581338765000;
        let timeZone = new Date(ts).toLocaleString("en-US", { timeZone: `${result.timezone}` });
        footer_info.innerHTML=`
        <div class="foot_info">Time Zone:  ${result.timezone}</div>
            <div class="foot_info">Date And Time: ${timeZone}</div>
            <div class="foot_info">Pincode: ${result.postal}</div>
            <div class="foot_info">Message: <span class="extra_text"> ${list[0].Message}</span></div>
        `
        showData.append(footer_info)

        const search_bar= document.createElement("div")
        search_bar.className="search_bar"
        search_bar.innerHTML=`
        <input type="text" class="materials-icon" id="search_input" placeholder="Filter">
        `
        showData.append(search_bar)

    
             const cards= document.createElement("div")
            cards.className="cards";
            cards.id="card_id"
            for(let i=0; i<list[0].PostOffice.length; i++){
                let post=list[0].PostOffice[i];
                const card= document.createElement("div");
                card.className="card"
                card.innerHTML=`
                <div class="name">Name: <span class="card-style">${post.Name}</span></div>
                    <div>Branch Type: <span class="card-style">${post.BranchType}</span></div>
                    <div>Delivery Status:<span class="card-style"> ${post.DeliveryStatus}</span></div>
                    <div>District:<span class="card-style"> ${post.District}</span></div>
                    <div>Division:<span class="card-style"> ${post.Division}</span></div>
                `
                cards.append(card)
            }
            showData.append(cards)

            // code for search filter 
           document.getElementById('search_input').addEventListener('keyup', filterPostalOffices);


    }

    function filterPostalOffices() {
        const cardList = document.getElementById('card_id').getElementsByClassName('card');
        const searchInput = document.getElementById('search_input');
        const searchTerm = searchInput.value.toLowerCase();
      
        Array.from(cardList).forEach(card => {
          const name = card.getElementsByClassName('name')[0].textContent.toLowerCase();
          const branchType = card.getElementsByTagName('div')[1].textContent.toLowerCase();
      
          if (name.includes(searchTerm) || branchType.includes(searchTerm)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      }