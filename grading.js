//****************************************************************************************************
// RENDER information on DOM

function renderStudent(student) {

    const studentId = document.querySelector("#student-id");
    studentId.textContent = student.id;

    const studentName = document.querySelector("#student-name");
    studentName.textContent = student.fullName;
}

function renderStudents() {

    getEmbeddedJSON("students", "grades")
    .then(students => {
        const dropdown = document.querySelector(`#student-select`);

        students.forEach(student => {
            const studentName = document.createElement("option");
            studentName.textContent = student.fullName;
            studentName.dataset.id = student.id;
    
            dropdown.append(studentName);
        })
    })
    .catch(e => console.error(e));
}

function createGradeRow() {

    const table = document.querySelector("#student-assignments table");
    const row = document.createElement("tr");

    // add rows for individual assignment

    const assignmentId = document.createElement("td");
    const assignmentName = document.createElement("td");
    const assignmentStart = document.createElement("td");
    const assignmentDue = document.createElement("td");
    const assignmentMaxPoints = document.createElement("td");

    // add rows for assignment grade

    const gradePoints = document.createElement("td");
    const percentage = document.createElement("td");
    const editGrade = document.createElement("td");
    editGrade.textContent = "edit";
    editGrade.classList.add("edit-column");

    row.append(assignmentId, assignmentName, assignmentStart, assignmentDue, assignmentMaxPoints, gradePoints, percentage, editGrade);
    table.append(row);

    return row;
}

function populateGradeRow(row, grade) {

    row.dataset.id = grade.id;
    row.dataset.assignmentId = grade.assignmentId;

    getJSONById("assignments", grade.assignmentId)
    .then(assignment => {

        // add details for individual assignment

        row.children[0].textContent = grade.assignmentId;
        row.children[1].textContent = assignment.name;
        row.children[2].textContent = assignment.startDate;
        row.children[3].textContent = assignment.dueDate;
        row.children[4].textContent = assignment.maxPoints;

        // add details for assignment grade

        row.children[5].textContent = grade.points;
        row.children[6].textContent = ((grade.points / assignment.maxPoints) * 100).toFixed(2) + '%';
        row.children[7].textContent = "edit";
        row.children[7].classList.add("edit-column")
    })
    .catch(e => console.error(e));
}

function renderGradeRow(grade, gradeId=0) {

    const table = document.querySelector("#student-assignments table");
    const row = (gradeId === 0) ? createGradeRow() : table.querySelector(`tr[data-id="${gradeId}"]`);

    populateGradeRow(row, grade);
}

function renderAssignmentInfo(assignment) {

    document.querySelector("#assignment-detail").dataset.id = assignment.id;

    const assignmentName = document.querySelector("#assignment-detail-name");
    assignmentName.textContent = assignment.name;

    const assignmentDescr = document.querySelector("#assignment-detail-description");
    assignmentDescr.textContent = assignment.description;
}

function renderStudentGrade(grade) {

    const form = document.querySelector("#edit-grading form");
    form.dataset.id = grade.id;

    const assignmentGrade = form["edit-grade"];
    assignmentGrade.value = grade.points;

    const assignmentComments = form["edit-comments"];
    assignmentComments.value = grade.comments;

    disableForm(form);
}

//****************************************************************************************************
// SUBMIT information from forms to db.json

function submitGradeEdits(gradeId, studentId, assignmentId) {

    const gradingForm = document.querySelector("#edit-grading form")
    
    const updatedGrade = {
        id: gradeId,
        points: gradingForm["edit-grade"].value,
        comments: gradingForm["edit-comments"].value,
        studentId: studentId,
        assignmentId: assignmentId
        }

    patchJSONToDb("grades", gradeId, updatedGrade);
    renderGradeRow(updatedGrade, gradeId);
}

//****************************************************************************************************
// ADD event handlers

function studentSelectListener() {

    const dropdown = document.querySelector(`#student-select`);

    dropdown.addEventListener("change", (e)=> {

        const selectedOption = dropdown.options[dropdown.selectedIndex];
        studentId = selectedOption.dataset.id;
        dropdown.dataset.id = studentId;

        getEmbeddedJSONById("students", studentId, "grades")
        .then(student => {
            renderStudent(student);

            document.querySelector("#student-assignments").classList.remove("hidden");

            const table = document.querySelector("#student-assignments table")
            table.querySelectorAll("td").forEach(r => r.remove());

            student.grades.forEach(grade => renderGradeRow(grade));

            document.querySelector("#edit-grading").classList.add("hidden");
        })
        .catch(e => console.error(e));
    })
}

function gradeSelectListener() {

    const table = document.querySelector("#student-assignments table");

    table.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit-column")) {

            const row = e.target.closest("tr");
            table.querySelectorAll("tr").forEach(r => r.classList.remove("active-row"));
            row.classList.add("active-row")

            const studentId = document.querySelector(`#student-select`).dataset.id;

            const gradeId = row.dataset.id;
            table.dataset.id = gradeId;

            const assignmentId = row.dataset.assignmentId;
            table.dataset.assignmentId = assignmentId;

            getEmbeddedJSONById("students", studentId, "grades")
            .then(student => {
                document.querySelector("#edit-grading").classList.remove("hidden");

                const grade = student.grades.find(grade => grade.id === gradeId);
                renderStudentGrade(grade);

                getJSONById("assignments", assignmentId)
                .then(assignment => {
                    renderAssignmentInfo(assignment);
                })
                .catch(e => console.error(e));
            })
            .catch(e => console.error(e));
        }
    });
}

function editGradeListener() {

    const form = document.querySelector("#edit-grading form");

    form.addEventListener("submit", (e) => {

        e.preventDefault();
        
        const submitBtn = document.querySelector("#submit-grade");
        const studentId = document.querySelector("#student-select").dataset.id;
        const gradeId = document.querySelector("#student-assignments table").dataset.id;
        const assignmentId = document.querySelector("#student-assignments table").dataset.assignmentId;

        // if form is in edit mode, submit changes
        if (submitBtn.value === "SUBMIT CHANGES") {
            submitGradeEdits(gradeId, studentId, assignmentId);
            disableForm(form);
        }
        else {
            enableForm(form);
        }
    })
}

//****************************************************************************************************
// LOAD page and call event listeners

function main() {

    // render student list
    renderStudents();

    // add event handlers
    studentSelectListener();
    gradeSelectListener();
    editGradeListener();
}

main();