function initTimetable() {
    const calendarData = {
        "2025-6": {
            1: { text: "Creative Collab Night", bg: "var(--accent2-color)" },
            7: { text: "Creative Collab Night", bg: "var(--accent2-color)" },
            8: { text: "Creative Collab Night", bg: "var(--accent2-color)" },
            2: { text: "Community Open Mic", bg: "var(--accent1-color)" },
            3: { text: "Community Open Mic", bg: "var(--accent1-color)" },
            4: { text: "Community Open Mic", bg: "var(--accent1-color)" },
            5: { text: "Community Open Mic", bg: "var(--accent1-color)" },
            20: { text: "In-Person Meetup", bg: "var(--text-color2)" },
        },
        "2025-5": {
            19: { text: "Board Game Bash", bg: "var(--success-color)" },
            24: { text: "Creative Collab Night", bg: "var(--accent2-color)" },
            25: { text: "Creative Collab Night", bg: "var(--accent2-color)" },
            31: { text: "Creative Collab Night", bg: "var(--accent2-color)" },
        },
        "2025-7": {
            7: { text: "Internship Starts", bg: "#ADD8E6" },
        },
    };

    const titles = ["May 2025", "June 2025", "July 2025"];
    const months = [4, 5, 6]; // 0 = Jan in JS
    let currentIndex = 1; // Start with June

    function renderCalendar(index) {
        const year = 2025;
        const month = months[index];
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const calendarBody = document.getElementById("calendarBody");
        const calendarTitle = document.getElementById("calendarTitle");
        calendarTitle.textContent = titles[index];
        calendarBody.innerHTML = "";

        let row = document.createElement("tr");
        let dayCount = 0;

        for (let i = 0; i < firstDay; i++) {
            row.appendChild(document.createElement("td"));
            dayCount++;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement("td");
            const dateDiv = document.createElement("div");
            dateDiv.className = "date";
            dateDiv.textContent = day;
            const contentDiv = document.createElement("div");
            contentDiv.className = "content";

            const key = `${year}-${month + 1}`;
            const dayData = calendarData[key]?.[day];

            if (dayData) {
                contentDiv.textContent = dayData.text;
                cell.style.backgroundColor = dayData.bg || "transparent";
            }

            cell.appendChild(dateDiv);
            cell.appendChild(contentDiv);
            row.appendChild(cell);
            dayCount++;

            if (dayCount % 7 === 0 || day === daysInMonth) {
                calendarBody.appendChild(row);
                row = document.createElement("tr");
            }
        }
    }

    document.getElementById("prevMonth").addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            renderCalendar(currentIndex);
        }
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        if (currentIndex < 2) {
            currentIndex++;
            renderCalendar(currentIndex);
        }
    });

    renderCalendar(currentIndex);
}

export { initTimetable };
