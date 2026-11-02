# Quantum Attendance Helper 🎓

A lightweight Chrome extension that helps **Quantum University students track their attendance** directly on the university student dashboard.

The extension automatically reads subject-wise attendance data and shows:

- Current attendance percentage
- Present / total lecture count
- Number of additional classes that can be missed while maintaining **75% attendance**
- Visual attendance status for each subject
- A summary dashboard above the existing attendance table
  
## 💀 Important 
The ERP's Year/Sem attendance summary is not updated immediately and may take around 2 days to reflect recent attendance. This means the "Can Miss" value can become outdated.

For example, if the extension shows "Can Miss: 1", you should check the last updated date shown in the ERP's Year/Sem Summary before deciding to skip a class. The calculation is only as accurate as the latest data available in the ERP.

:> For lab classes it is not taking two classes to calculate so if there is showing can miss 2 classes then u can miss only 1 class for lab subject bcz in lab there is 2 absent or 2 present u get in one day.


## ✨ Features

### 📊 Attendance Percentage

The extension calculates attendance for each subject using:

```text
Attendance = (Total Present / Total Lectures) × 100
```

The attendance percentage is displayed up to two decimal places.

### 🎯 "Can Miss" Calculator

The extension calculates how many additional classes can be missed while keeping attendance at or above the required **75%**.

For example:

```text
Present: 38
Total: 48
Attendance: 79.17%

Can Miss: 3 classes
```

This calculation is performed automatically for every subject.

### 🚦 Attendance Status

Each subject is given a visual status:

| Status | Meaning |
|---|---|
| 🟢 Safe | More than 1 class can be missed |
| 🟡 Warning | Only 0–1 classes can be missed |
| 🔴 Danger | Attendance is below 75% |

The same status system is used in both the summary cards and the attendance table.

### 📋 Summary Dashboard

The extension creates an **Attendance Helper** section above the university attendance table.

Each subject card displays:

```text
Subject Name
Subject Code
Attendance %
Present / Total
Can miss X classes
```

If no additional classes can be missed, it displays:

```text
Don't miss another class
```

### ➕ "Can Miss" Table Column

A new **Can Miss** column is added directly to the university's attendance table, allowing you to see the calculation alongside the original attendance information.

### 🔄 Automatic Updates

The extension uses a `MutationObserver` to detect changes to the page and automatically recalculate attendance when the dashboard data changes.

A small update delay is used to avoid repeatedly processing the page while it is being modified.

## 🛠️ Technologies

- **JavaScript**
- **CSS**
- **Chrome Extension Manifest V3**
- **DOM APIs**
- **MutationObserver**

## 📁 Project Structure

```text
Quantum-Attendance-Helper/
│
├── manifest.json
├── content.js
├── style.css
└── README.md
```

### `manifest.json`

Defines the Chrome extension configuration and loads the content script and stylesheet on the Quantum University student dashboard.

### `content.js`

Contains the main functionality of the extension.

It:

1. Reads subject-wise attendance from the university table.
2. Calculates attendance percentage.
3. Calculates how many classes can be missed.
4. Adds the **Can Miss** column.
5. Creates the attendance summary cards.
6. Detects changes to the dashboard and updates the information automatically. 

### `style.css`

Controls the appearance of the Attendance Helper dashboard, including the summary cards, attendance percentage, and safe/warning/danger indicators.

## 🚀 Installation

This extension can currently be installed manually using Chrome's **Developer Mode**.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/quantum-attendance-helper.git
```

Then enter the project directory:

```bash
cd quantum-attendance-helper
```

### 2. Open Chrome Extensions

Open:

```text
chrome://extensions/
```

### 3. Enable Developer Mode

Enable **Developer mode** from the top-right corner.

### 4. Load the extension

Click:

**Load unpacked**

Select the folder containing:

```text
manifest.json
content.js
style.css
```

### 5. Open the Quantum University Dashboard

Open the Quantum University student dashboard.

The Attendance Helper should automatically appear when the attendance table is available.

## 🧮 Attendance Calculation

The extension uses a minimum required attendance of:

```text
75%
```

This value is defined in `content.js`.

The number of classes that can be missed is calculated based on the current number of present classes and total lectures.

The result is never allowed to become negative, so subjects where the student cannot safely miss another class show:

```text
0
```

and the summary displays:

```text
Don't miss another class
```

## 🔒 Privacy

The extension is designed to operate on the Quantum University student dashboard.

It reads attendance information already displayed on the webpage and adds calculations and UI elements to that page.

It does not need a separate backend server for its attendance calculations.

## ⚠️ Disclaimer

**Quantum Attendance Helper is an unofficial student-made project.**

It is not affiliated with, endorsed by, or officially maintained by Quantum University.

The extension only calculates and displays attendance information. It does **not modify university attendance records**.

Always verify important attendance information with the official university portal.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

If you find a problem or want to suggest an improvement:

1. Open an issue.
2. Describe the problem or feature clearly.
3. Fork the repository.
4. Create a new branch.

```bash
git checkout -b feature/your-feature
```

5. Make your changes.
6. Test the extension locally.
7. Commit your changes.

```bash
git add .
git commit -m "Add: your feature"
```

8. Push your branch.

```bash
git push origin feature/your-feature
```

9. Open a Pull Request.

## 🔮 Possible Future Improvements

Some possible improvements for future versions:

- 🔔 Low-attendance warnings
- 🎯 Target attendance calculator
- 📝 Better handling of dynamically loaded dashboard data

## 📄 License

This project is open source. See the repository license for details.

---

**Quantum Attendance Helper**  
Made to save students from doing attendance calculations manually.
