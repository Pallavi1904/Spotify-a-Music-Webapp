console.log("Lets write javascript");
let songs;
let currentsong = new Audio();  //global variable
let currfolder;


function sectomin(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function main(folder){
   currfolder=folder;
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response =await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
   songs=[];
    for(let index=0;index<as.length;index++){
        const element = as[index];
        if(element.href.endsWith(".mpeg")){
           songs.push(element.href.split(`/${folder}/`)[1]); 
        }
        }
    



let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
songUL.innerHTML=""
for (const song of songs){
    songUL.innerHTML=songUL.innerHTML+ `<li>
                  <div class="info">
                   <div>${song.replaceAll("%20"," ")}</div>
                   <div>#Play & Enjoy</div>
                  </div>
                <div class="playnow">
                 <span>Play Now</span>
                  <div class="invert "><img src="play.svg" alt=""></div>
                </div> </li>`;
}


Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element=>{

        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    });
   
});
}

const playMusic=(track,pause=false)=>{
//  let audio =new Audio("/songs/" + track); 
currentsong.src=`/${currfolder}/` + track;
if(!pause){
    currentsong.play();
    play.src="pause.svg";  
}

 
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main2(){
  await main("songs/ncs");
  playMusic(songs[0], true);

play.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play();
        play.src="pause.svg";

    }
    else{
        currentsong.pause();
        play.src="play.svg";
    }
})

//Time update for currentsong
  currentsong.addEventListener("timeupdate", ()=>{
    document.querySelector(".songtime").innerHTML = `${sectomin(currentsong.currentTime)}/
    ${sectomin(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
  })


  //Add event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)* 100;
   document.querySelector(".circle").style.left = percent + "%";
   currentsong.currentTime = ((currentsong.duration) * percent)/100 ;
  })

  //Add eventlistner for hamburger
  document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "0";
  })
  //Add eventlistner for closing hamburger
  document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-120%";
  })

  //Add eventlistner to Previous and Next
   previous.addEventListener("click", ()=>{
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index-1) >= 0 ){
      playMusic(songs[index-1]);
    }
   })

   next.addEventListener("click", ()=>{
   let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
     if((index+1) < songs.length ){
      playMusic(songs[index+1]);
    }
   })

   //Whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
      e.addEventListener("click", async items=>{
        songs = await main(`songs/${items.currentTarget.dataset.folder}`)
      })
    })
     
}
    

main2();