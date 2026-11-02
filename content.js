(() => {
    "use strict";
    const REQUIRED_ATTENDANCE = 75;
    const TABLE_ID = "tblYearSemWiseAttendance";
    let lastProcessedData = "";
    let updateTimer = null;
    console.log("Quantum Attendance Helper loaded.");

    function getCell(row, columnName) {
        return row.querySelector(
            `[aria-describedby="${TABLE_ID}_${columnName}"]`
        );
    }

    function getCellText(row, columnName) {
        const cell = getCell(row, columnName);
        if (!cell) {
            return "";
        }
        return cell.innerText.trim();
    }

    function getAttendanceData() {
        const rows = document.querySelectorAll(
            `#${TABLE_ID} tbody tr.jqgrow`
        );
        const subjects = [];

        rows.forEach((row) => {
            const subject = getCellText(row, "Subject");
            const subjectCode = getCellText(row, "SubjectCode");

            const totalLecture = Number(
                getCellText(row, "TotalLecture")
            );

            const totalPresent = Number(
                getCellText(row, "TotalPresent")
            );

            const totalAbsent = Number(
                getCellText(row, "TotalAbsent")
            );

            const totalLeave = Number(
                getCellText(row, "TotalLeave")
            );

            if (!subject || !Number.isFinite(totalLecture)) {
                return;
            }

            if (!Number.isFinite(totalPresent)) {
                return;
            }

            const attendance =
                totalLecture > 0
                    ? (totalPresent / totalLecture) * 100
                    : 0;

            let canMiss = 0;
            if (totalLecture > 0) {
                canMiss = Math.floor(
                    totalPresent / (REQUIRED_ATTENDANCE / 100)
                    - totalLecture
                );
            }

            // Prevent negative values.
            canMiss = Math.max(0, canMiss);

            subjects.push({
                subject,
                subjectCode,
                totalLecture,
                totalPresent,
                totalAbsent,
                totalLeave,
                attendance,
                canMiss,
                row
            });
        });

        return subjects;
    }

    function getAttendanceStatus(attendance, canMiss) {
        if (attendance < REQUIRED_ATTENDANCE) {
            return "danger";
        }

        if (canMiss <= 1) {
            return "warning";
        }

        return "safe";
    }

    function createCell(text, className = "") {
        const cell = document.createElement("td");

        cell.className = className;

        cell.textContent = text;

        cell.style.textAlign = "center";

        return cell;
    }

    function addCanMissColumn(subjects) {
        const table = document.getElementById(TABLE_ID);

        if (!table) {
            return;
        }

        const rows = table.querySelectorAll(
            "tbody tr.jqgrow"
        );

        rows.forEach((row) => {
            const oldCell = row.querySelector(
                ".qah-can-miss"
            );

            if (oldCell) {
                oldCell.remove();
            }
        });

        const headerRows = table.querySelectorAll(
            "thead tr"
        );

        headerRows.forEach((headerRow) => {
            const oldHeader = headerRow.querySelector(
                ".qah-can-miss-header"
            );

            if (oldHeader) {
                oldHeader.remove();
            }

            const headerCell = document.createElement("th");

            headerCell.className =
                "qah-can-miss-header";

            headerCell.textContent = "Can Miss";

            headerCell.style.textAlign = "center";

            headerRow.appendChild(headerCell);
        });

        subjects.forEach((subject) => {
            const status = getAttendanceStatus(
                subject.attendance,
                subject.canMiss
            );

            const cell = createCell(
                `${subject.canMiss}`,
                `qah-can-miss ${status}`
            );

            cell.title =
                `You can miss ${subject.canMiss} more ` +
                `class${subject.canMiss === 1 ? "" : "es"} ` +
                `while maintaining ${REQUIRED_ATTENDANCE}% attendance.`;

            subject.row.appendChild(cell);
        });
    }

    function createSummary(subjects) {
        const existing =
            document.getElementById(
                "qah-summary"
            );

        if (existing) {
            existing.remove();
        }

        if (subjects.length === 0) {
            return;
        }

        const summary = document.createElement("div");

        summary.id = "qah-summary";

        const heading = document.createElement("div");

        heading.className = "qah-heading";

        heading.textContent =
            "Attendance Helper";

        summary.appendChild(heading);

        const subtitle = document.createElement("div");

        subtitle.className = "qah-subtitle";

        subtitle.textContent =
            `Minimum required attendance: ${REQUIRED_ATTENDANCE}%`;

        summary.appendChild(subtitle);

        const grid = document.createElement("div");

        grid.className = "qah-grid";

        subjects.forEach((subject) => {
            const card = document.createElement("div");

            const status = getAttendanceStatus(
                subject.attendance,
                subject.canMiss
            );

            card.className =
                `qah-card ${status}`;

            const name = document.createElement("div");

            name.className = "qah-subject";

            name.textContent = subject.subject;

            name.title = subject.subject;

            card.appendChild(name);

            const code = document.createElement("div");

            code.className = "qah-code";

            code.textContent =
                subject.subjectCode;

            card.appendChild(code);

            const attendance = document.createElement("div");

            attendance.className =
                "qah-attendance";

            attendance.textContent =
                `${subject.attendance.toFixed(2)}%`;

            card.appendChild(attendance);

            const details = document.createElement("div");

            details.className = "qah-details";

            details.textContent =
                `${subject.totalPresent}/${subject.totalLecture}`;

            card.appendChild(details);

            const canMiss = document.createElement("div");

            canMiss.className = "qah-can-miss-text";

            canMiss.textContent =
                subject.canMiss === 0
                    ? "Don't miss another class"
                    : `Can miss ${subject.canMiss} ${
                        subject.canMiss === 1
                            ? "class"
                            : "classes"
                    }`;

            card.appendChild(canMiss);

            grid.appendChild(card);
        });

        summary.appendChild(grid);

        const table =
            document.getElementById(TABLE_ID);

        if (table) {
            const container =
                table.closest(".ui-jqgrid");

            if (container) {
                container.parentNode.insertBefore(
                    summary,
                    container
                );
            } else {
                table.parentNode.insertBefore(
                    summary,
                    table
                );
            }
        }
    }

    function addTableColumnHeaderFallback() {
        const table =
            document.getElementById(TABLE_ID);

        if (!table) {
            return;
        }

    }

    function processAttendance() {
        const table =
            document.getElementById(TABLE_ID);

        if (!table) {
            return;
        }

        const subjects = getAttendanceData();

        if (subjects.length === 0) {
            return;
        }

        const currentData =
            JSON.stringify(
                subjects.map((subject) => ({
                    subject: subject.subject,
                    totalLecture:
                        subject.totalLecture,
                    totalPresent:
                        subject.totalPresent,
                    totalAbsent:
                        subject.totalAbsent,
                    totalLeave:
                        subject.totalLeave
                }))
            );

        if (currentData === lastProcessedData) {
            return;
        }

        lastProcessedData = currentData;

        addCanMissColumn(subjects);

        createSummary(subjects);

        console.log(
            "Quantum Attendance Helper:",
            subjects
        );
    }

    function scheduleUpdate() {
        clearTimeout(updateTimer);

        updateTimer = setTimeout(() => {
            processAttendance();
        }, 300);
    }

    const observer =
        new MutationObserver(() => {
            scheduleUpdate();
        });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check
    processAttendance();

})();