(() => {
  const storageKey = "northstar-workspace-records";
  const initialRecords = [
    { id: "sample-1", initiative: "Automate meeting notes", owner: "Product team", hours: 12, status: "In progress" },
    { id: "sample-2", initiative: "Connect team knowledge", owner: "Engineering", hours: 8, status: "Planned" },
    { id: "sample-3", initiative: "Streamline weekly updates", owner: "Operations", hours: 16, status: "Complete" },
  ];
  const form = document.querySelector("#record-form");
  const rows = document.querySelector("#record-rows");
  const formTitle = document.querySelector("#form-title");
  const formMessage = document.querySelector("#form-message");
  const submitButton = document.querySelector("#submit-record");
  const cancelButton = document.querySelector("#cancel-edit");
  const recordCount = document.querySelector("#record-count");
  let records = initialRecords;
  let editingId = null;
  let storageAvailable = true;

  try {
    const savedRecords = localStorage.getItem(storageKey);
    if (savedRecords !== null) {
      const parsedRecords = JSON.parse(savedRecords);
      if (!Array.isArray(parsedRecords)) throw new Error("Saved records are not a list.");
      records = parsedRecords;
    }
  } catch (error) {
    storageAvailable = false;
    formMessage.textContent = `Browser storage is unavailable; changes will only last for this visit. (${error.message})`;
    formMessage.setAttribute("role", "alert");
  }

  function saveRecords() {
    if (!storageAvailable) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(records));
    } catch (error) {
      storageAvailable = false;
      formMessage.textContent = `Could not save records in this browser. Changes will only last for this visit. (${error.message})`;
      formMessage.setAttribute("role", "alert");
    }
  }

  function renderRecords() {
    rows.replaceChildren();
    recordCount.textContent = `${records.length} ${records.length === 1 ? "record" : "records"}`;

    if (records.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No records yet. Add a workspace initiative below.";
      row.append(cell);
      rows.append(row);
      return;
    }

    records.forEach((record) => {
      const row = document.createElement("tr");
      const initiative = document.createElement("td");
      initiative.textContent = record.initiative;
      const owner = document.createElement("td");
      owner.textContent = record.owner;
      const hours = document.createElement("td");
      hours.textContent = `${record.hours} hrs`;
      const status = document.createElement("td");
      const statusPill = document.createElement("span");
      statusPill.className = "status-pill";
      statusPill.textContent = record.status;
      status.append(statusPill);
      const actions = document.createElement("td");
      const actionGroup = document.createElement("div");
      actionGroup.className = "record-actions";
      const editButton = document.createElement("button");
      editButton.className = "small-button";
      editButton.type = "button";
      editButton.textContent = "Edit";
      editButton.setAttribute("aria-label", `Edit ${record.initiative}`);
      editButton.addEventListener("click", () => startEditing(record));
      const deleteButton = document.createElement("button");
      deleteButton.className = "small-button delete";
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete ${record.initiative}`);
      deleteButton.addEventListener("click", () => deleteRecord(record.id));
      actionGroup.append(editButton, deleteButton);
      actions.append(actionGroup);
      row.append(initiative, owner, hours, status, actions);
      rows.append(row);
    });
  }

  function resetForm() {
    form.reset();
    editingId = null;
    formTitle.textContent = "Add a workspace initiative";
    submitButton.textContent = "Add record";
    cancelButton.style.display = "none";
  }

  function startEditing(record) {
    editingId = record.id;
    form.elements.initiative.value = record.initiative;
    form.elements.owner.value = record.owner;
    form.elements.hours.value = record.hours;
    form.elements.status.value = record.status;
    formTitle.textContent = "Update workspace initiative";
    submitButton.textContent = "Save changes";
    cancelButton.style.display = "inline-flex";
    form.elements.initiative.focus();
    formMessage.textContent = `Editing "${record.initiative}".`;
  }

  function deleteRecord(id) {
    const deletedRecord = records.find((record) => record.id === id);
    records = records.filter((record) => record.id !== id);
    if (editingId === id) resetForm();
    saveRecords();
    renderRecords();
    formMessage.textContent = deletedRecord ? `"${deletedRecord.initiative}" deleted.` : "Record deleted.";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const record = {
      id: editingId || (globalThis.crypto?.randomUUID?.() ?? `record-${Date.now()}-${Math.random().toString(16).slice(2)}`),
      initiative: String(data.get("initiative")).trim(),
      owner: String(data.get("owner")).trim(),
      hours: Number(data.get("hours")),
      status: String(data.get("status")),
    };

    if (!record.initiative || !record.owner || !Number.isFinite(record.hours) || record.hours < 0) {
      formMessage.textContent = "Enter an initiative, an owner, and a non-negative number of hours.";
      formMessage.setAttribute("role", "alert");
      return;
    }

    if (editingId) {
      records = records.map((item) => item.id === editingId ? record : item);
      formMessage.textContent = `"${record.initiative}" updated.`;
    } else {
      records = [record, ...records];
      formMessage.textContent = `"${record.initiative}" added.`;
    }

    formMessage.setAttribute("role", "status");
    resetForm();
    saveRecords();
    renderRecords();
  });

  cancelButton.addEventListener("click", () => {
    resetForm();
    formMessage.textContent = "Editing cancelled.";
  });

  renderRecords();
})();
