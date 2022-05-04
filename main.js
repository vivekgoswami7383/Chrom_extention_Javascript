chrome.idle.setDetectionInterval(15);   // Default chrom idle time is 15 sec but we can set as we want

const getItem = () => localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {}
// Get localstorage data function so we don't need to write code for getItems everytime

const setItem = (input = {})  => {
    localStorage.setItem('data',JSON.stringify({...getItem(),...input}))
}   // Set localstorage data function so we don't need to write code for getItems everytime

setItem({
    stopTimer:false
})

// First we are set stopTimer = false becuase very first time we don't shaw timer

const button = document.getElementById("startTimer")

const hasClass = (name) => button.classList.contains (name);
const removeClass = (name) => button.classList.remove(name);     // Here we have added some functions for managing class
const addClass = (name) => button.classList.add(name);

const playMusic = () => {
    const music = document.getElementById("audio")              // Playmusic function
    music.play()
}

const getTime = () => [new Date().getMinutes(),new Date().getSeconds(),new Date().getHours()]  // For get latest time
let soundBuzzer = false
button.addEventListener("click", function (e) {          // When user click on start button
    const {stopTimer} = getItem()                       // Get time from localstorage
    if(hasClass('start')){                             // If class was start then only start button will called
        removeClass('start')                          // When click on start button we Just remove start class and
        addClass('stop')                             // Adding new stop class
        soundBuzzer = true
        button.innerHTML = "Stop Time"              // Button text will change from start time to stop time after click event
        document.getElementById("paragraph").innerHTML = "🎉 Wohoooo, Timer was started"
        if(soundBuzzer){
            playMusic()                                // After clcik we will play music for one time
        }

        setItem({stopTimer : false,start:true})  // We are change stopTimer from true to false so timer will called continually

        window.firstIntervel = setInterval(function() {
            const [minute,sec,hour] = getTime()      // We are Just called getTime function
            if(!stopTimer){ // If stopTimer was not true then it will display timer continually, we were change stopTimer value on start button click (line number 35)
                const amPm = hour > 12 ? "PM" : "AM" // Make AM PM by simple logic
                const temp = hour + " : " + minute + " : " + sec + " " + " " + amPm; // Making timer by concating some string
                setItem({timeData : temp}) // We were continually saved timer data in localstorage
                document.getElementById("showTimer").innerHTML = getItem().timeData  // Then fetch timer data from localstorage and display them
            }else{
                const temp = hour + " : " + minute + " : " + sec;
                document.getElementById("showTimer").innerHTML = temp // IF stopTimer was true, in the sense we haven't called start timer button yet or we have stop button then it will be display only the last timer
                clearInterval(firstIntervel) // If stopTimer was true then we display only last time so there are no need to called again it using interval so we are clearing the interval
            }
        }, 1000); // Interval called at every one second

    }else if(hasClass('stop')){  // If value of class is stop then it will called stop button either start button
        removeClass('stop')     // After clicking on that we are removing stop class so next time it will called start button
        addClass('start')       // We are adding start class
        soundBuzzer = false
        button.innerHTML = "Start Time" // Change button name from start time to stop time
        document.getElementById("paragraph").innerHTML = "Hello, please start the timer"
        setItem({stopTimer : true,start:false})  // If we click on stop button then we have to stop timer so we are change stopTimer value
        clearInterval(window.firstIntervel)  // If we click on stop button then timer must have to stop so clearing that interval
        clearInterval(window.interval)      //  We must hvae to clear this interval also
    }
})

chrome.idle.onStateChanged.addListener( // So Instead of screen sleep we have found another solution which was given by chrom extention
  function (state) {
    if(getItem().start){   // We are Just double cross for play music
      if (state === "idle"){ // If we not give any input for 15 sec then our pc going to idle mode os we are checking the idle mode
        window.interval = setInterval(() => {   // If it will found as a idle mode then system will play music at every one second
              playMusic()
          }, 1000);
      }
    }
  }
);

const initials = () => {                                    // We have to make this function because in chrom extention if we click on anywhere on page then it will be reolad the page internally so value was going removed so have put this functionality
    if(!getItem().stopTimer && getItem().start) {     // Same condition as we see above for start timer
        window.firstIntervel = setInterval(function() {
            if(!getItem().start) return    // If it is start then we don't need to display last time
            const [minute,sec,hour] = getTime()
            if(!getItem().stopTimer){     // Same condition as we see for display timer
                const amPm = hour > 12 ? "PM" : "AM"
                const temp = hour + " : " + minute + " : " + sec + " " + " " + amPm;
                setItem({timeData : temp})
                document.getElementById("showTimer").innerHTML = getItem().timeData
                document.getElementById("paragraph").innerHTML = "🎉 Wohoooo, Timer was started"
            }else{
                const temp = hour + " : " + minute + " : " + sec;
                document.getElementById("showTimer").innerHTML = temp
                clearInterval(firstIntervel)
            }
        }, 1000);
        button.innerHTML = "Stop Time"
    }
}

initials()