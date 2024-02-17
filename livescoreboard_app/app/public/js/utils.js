function play_firstblood() {
    var audio = new Audio("./audio/first_blood.mp3");
    audio.volume = 0.05
    audio.play();
}

function parse_activity_date(date) {
    const dateObj = new Date(date)
    const year = dateObj.getUTCFullYear();
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getUTCDate().toString().padStart(2, '0');
    const hour = dateObj.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getUTCSeconds().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} - ${hour}:${minutes}:${seconds}`;
    return formattedDate;
}

function parse_firtblood_time(date) {
    const dateTime = new Date(date);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for noon/midnight
    const formattedTime = `${formattedHours} ${amPm}, ${minutes} MIN, ${seconds} SEC`;
    return formattedTime;
}

function countdown(start, finish) {
    var timer = null;
    var end;
    var toZero;
    var start = new Date(start);
    var finish = new Date(finish);
    var now = new Date()

    if (now < start){
        var date = (start.getTime() - now.getTime()) / 1000;
        var day = Math.floor(date / (60 * 60 * 24));
    } else if (now > start){
        var date = (finish.getTime() - now.getTime()) / 1000;
        var day = Math.floor(date / (60 * 60 * 24));
    }
    
    var _hour = date - day * 60 * 60 * 24;
    var hour = Math.floor(_hour / (60 * 60));
    var _minute = _hour - hour * 60 * 60;
    var minute = Math.floor(_minute / (60));
    var _second = _minute - minute * 60;
    var second = Math.floor(_second);
    if (now > start) {
            // currently running
            $("#countdown").html("<span style='color:orange;'> Ends in: " + day + "\
                Days, " + hour + "\
                Hours, " + minute + "\
                Minutes, " + second + "\
                Seconds. </span>");
    } else if (now == finish) {
            // just ended right now
            // confetti in ending
            $("#countdown").html("<span style='color:red;'> SparkCTF Ended!GGs </span>");
    } else if (now > finish) {
            $("#countdown").html(" <span style='color:red;'> SparkCTF Ended!GGs </span>");
    } else if (now < start) {
            // didnt start yep
            $("#countdown").html("<span style='color:lightgreen;'> Starts in: " + day + "\
                Days, " + hour + "\
                Hours, " + minute + "\
                Minutes, " + second + "\
                Seconds. </span>");
    }
}

function displayNextNotification() {
    if (notificationQueue.length > 0 && !isDisplayingNotification) {
            isDisplayingNotification = true;
            const notification = notificationQueue.shift(); // Get the next notification
            start()
            stop()
            $("#firstblood_mp3").click();
            notif(notification);
            // After a delay, hide the notification and move to the next one
            setTimeout(() => {
                    isDisplayingNotification = false;
                    displayNextNotification(); // Display the next notification in the queue
            }, 11000); // Adjust the delay as needed
    }
}
star_svg = '<svg width="20" height="20" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFC56E"><path d="M4.29737 10.418C4.29157 11.9371 5.03243 12.8037 6.71534 12.8359C5.15301 12.8301 4.37668 13.6684 4.29737 15.2539C4.28383 13.758 3.61389 12.8359 1.87939 12.8359C3.43141 12.8147 4.29157 12.0654 4.29737 10.418Z" stroke-width="0.96719" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.41797 0.746094C3.41217 2.26523 4.15304 3.13183 5.83595 3.16407C4.27362 3.15827 3.49728 3.9965 3.41797 5.58204C3.40443 4.08612 2.73449 3.16407 1 3.16407C2.55202 3.14279 3.41217 2.39354 3.41797 0.746094Z" stroke-width="0.96719" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.9205 3.38477C10.9091 6.30216 12.3274 7.95694 15.5648 8.02992C12.5621 8.01848 11.0727 11.7694 10.9205 14.8152C10.8915 11.9418 9.60692 8.02552 6.27539 8.02992C9.25609 7.98771 10.9091 6.54924 10.9205 3.38477Z" stroke-width="1.3189" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
blood_svg = '<svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30.834 26.9122C30.834 29.8959 29.6487 32.7574 27.5389 34.8672C25.4292 36.9769 22.5677 38.1622 19.584 38.1622C16.6003 38.1622 13.7388 36.9769 11.629 34.8672C9.51925 32.7574 8.33398 29.8959 8.33398 26.9122C8.33398 18.7955 15.7473 6.55887 18.5373 2.24554C18.6495 2.0697 18.8043 1.92496 18.9872 1.8247C19.1701 1.72443 19.3754 1.67188 19.584 1.67188C19.7926 1.67187 19.9978 1.72443 20.1808 1.8247C20.3637 1.92496 20.5184 2.0697 20.6307 2.24554C23.4207 6.55887 30.834 18.7955 30.834 26.9122Z" stroke="#FC3535" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.584 33.1691C18.7628 33.1691 17.9497 33.0072 17.1911 32.6928C16.4324 32.3784 15.7432 31.9176 15.1628 31.3367C14.5824 30.7558 14.1221 30.0662 13.8083 29.3074C13.4945 28.5485 13.3333 27.7352 13.334 26.9141" stroke="#FC3535" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'