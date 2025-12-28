document.addEventListener("DOMContentLoaded", function () {
       

    const fortuneBtn = document.getElementById("fortuneButton");
    const fortuneDiv = document.getElementById("fortune");

    if (!fortuneBtn || !fortuneDiv) return;

    fortuneBtn.addEventListener("click", async function () {
        fortuneBtn.textContent = "Generating fortune...";

        try {
            const res = await fetch("/api/fortune");
            const data = await res.json();
            fortuneDiv.textContent = data.fortune;
        }
        catch (err) {
            fortuneDiv.textContent = "The fortune maker has failed all of his clases and has to retake and pass them to start working on the project again.";
        }
    });

});
