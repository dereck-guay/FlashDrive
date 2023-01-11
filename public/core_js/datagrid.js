class DataGrid extends DatasetComponent {
    constructor(params) {
        super(params.dataset, params.containerElement);

        // Private Properties
        this._tableElement = undefined;
        this._toolbarElement = undefined;
        this._headElement = undefined;
        this._bodyElement = undefined;
        this._footElement = undefined;
        this._structure = params.structure;
        this._isPrepend = params.isPrepend || false;
        this._editRecordId = undefined;

        // Callbacks
        this.onRowClicked = params.onRowClick;
        this.onRowDblClick = params.onRowDblClick;

        // Loading
        this.initialize();
    }

    // Datagrid Events
    onRowClick(rowClicked) {
        let recordId = rowClicked.getAttribute('dataset-record-id');
        this.dataset.setPosition(recordId);

        if (this.onRowClicked instanceof Function) this.onRowClicked();
    }

    // Dataset Events
    datasetOnPositionChange(dto) {
        if (dto.position == undefined) return;
        this._select(dto.position);
    }

    datasetOnValueChange(dto) {
        let { field, record } = dto;
        let cellToReplace = document.querySelector(`tr[dataset-record-id="${record.id}"] td[dataset-record-field="${field}"]`);
        if (cellToReplace == undefined) return;
        if (cellToReplace.querySelector('input, select, textarea') != undefined) return;

        let column = this._structure.columns.find(c => c.field == field);
        if (column == undefined) return;

        let newCell = this._buildCell(column, record);
        cellToReplace.replaceWith(newCell);
    }

    datasetOnInsert(dto) {
        let newRow = this._buildRow(dto.record);
        let emptyRowIndicator = this._bodyElement.querySelector('.datagrid-is-empty');
        console.log(emptyRowIndicator)
        if (emptyRowIndicator != undefined) emptyRowIndicator.remove();

        if (this._isPrepend) {
            this._bodyElement.prepend(newRow);
            return;
        }

        this._bodyElement.append(newRow);
    }

    datasetOnDelete(dto) {
        let recordId = dto.record.get('id');
        let rowToDelete = document.querySelector(`tr[dataset-record-id="${recordId}"]`);
        rowToDelete.remove();
        if (this.dataset.getAllRecords().length <= 0)
            this._bodyElement.innerHTML = `<tr class="datagrid-is-empty"><td colspan="${this._structure.columns.length}">Wow such empty...</td></tr>`;
    }

    //Public Methods
    render() {
        if (this._structure == undefined) return;
        let { toolbar, columns, footer } = this._structure;

        this._tableElement = this._buildTable();
        this._headElement = this._buildThead();
        this._bodyElement = this._buildBody();

        this._tableElement.append(
            this._headElement,
            this._bodyElement
        );

        this.containerElement.innerHTML = '';
        this.containerElement.append(this._tableElement);
    }

    setRowEdit(recordId) {
        let record = this.dataset.getRecord(recordId);
        let rowToReplace = document.querySelector(`tr[dataset-record-id="${recordId}"]`);
        if (rowToReplace == undefined) return;

        this._editRecordId = recordId;
        let newRow = this._buildRow(record);
        rowToReplace.replaceWith(newRow);
        if (recordId == this.dataset.getPosition()) this._select(recordId);
        return newRow;
    }

    updateRow(recordId) {
        let record = this.dataset.getRecord(recordId);
        let rowToReplace = document.querySelector(`tr[dataset-record-id="${recordId}"]`);
        if (rowToReplace == undefined) return;

        this._editRecordId = undefined;
        let newRow = this._buildRow(record);
        rowToReplace.replaceWith(newRow);
        if (recordId == this.dataset.getPosition()) this._select(recordId);
        return newRow;
    }

    // Private Methods
    _buildTable() {
        let { tableClass, tableCss } = this._structure;
        let tableElement = document.createElement('table');

        // Table Class
        if ( tableClass instanceof Function) tableElement.className = tableClass(dataset);
        else if (typeof(tableClass) == 'string') tableElement.className = tableClass;

        // Table Css
        if ( tableCss instanceof Function) tableElement.style = tableCss(dataset);
        else if (typeof(tableCss) == 'string') tableElement.style = tableCss;

        tableElement.classList.add('datagrid');
        return tableElement;
    }

    _buildThead() {
        let { columns, theadClass } = this._structure;
        let thead = document.createElement('thead');
        thead.className = theadClass || 'text-white bg-gradient-to-br from-blue-500 to-blue-700';
        let tr = document.createElement('tr');

        for (let { title, headerClass, headerCss, selectable } of columns) {
            let th = document.createElement('th');

            // th Class
            if ( headerClass instanceof Function) th.className = headerClass(dataset);
            else if (typeof(headerClass) == 'string') th.className = headerClass;

            // th Css
            if ( headerCss instanceof Function) th.style = headerCss(dataset);
            else if (typeof(headerCss) == 'string') th.style = headerCss;

            if (selectable) {
                let allCheckbox = document.createElement('input');
                allCheckbox.type = 'checkbox';
                allCheckbox.onclick = e => this._checkAll(e.target.checked);
                th.append(allCheckbox);
                tr.append(th);
                continue;
            }

            if (title instanceof Function) {
                let titleResult = title(th, this.dataset, this);
                if (titleResult != undefined) td.innerHTML = titleResult;
                tr.append(th);
                continue;
            }

            th.innerHTML = title || '';

            tr.append(th);
        }

        thead.append(tr);
        thead.classList.add('datagrid_head');
        return thead;
    }

    _buildBody() {
        let tbody = document.createElement('tbody');
        let records = this.dataset.getAllRecords();

        if (records.length <= 0)
            tbody.innerHTML = `<tr class="datagrid-is-empty"><td colspan="${this._structure.columns.length}">Wow such empty...</td></tr>`;

        for (let record of records)
            tbody.append(this._buildRow(record));


        tbody.classList.add('datagrid_body');
        return tbody;
    }

    _buildRow(record) {
        let { columns, rowClass, rowCss } = this._structure;
        let tr = document.createElement('tr');

        tr.setAttribute('dataset-record-id', record[this.dataset.primaryKey]);
        tr.addEventListener('click', e => this.onRowClick(e.currentTarget));
        tr.addEventListener('dblclick', e => {
            if (this.onRowDblClick instanceof Function) this.onRowDblClick(e);
        });

        // tr Class
        if ( rowClass instanceof Function) tr.className = rowClass(dataset);
        else if (typeof(rowClass) == 'string') tr.className = rowClass;

        // tr Css
        if ( rowCss instanceof Function) tr.style = rowCss(dataset);
        else if (typeof(rowCss) == 'string') tr.style = rowCss;

        for (let column of columns)
            tr.append(this._buildCell(column, record));

        return tr;
    }

    _buildCell(column, record) {
        let { field, name, cellClass, cellCss, display, format, selectable, editable } = column;
        let td = document.createElement('td');

        td.setAttribute('dataset-record-field', name || field);

        // td Class
        if ( cellClass instanceof Function) td.className = cellClass(dataset);
        else if (typeof(cellClass) == 'string') td.className = cellClass;

        // td Css
        if ( cellCss instanceof Function) td.style = cellCss(dataset);
        else if (typeof(cellCss) == 'string') td.style = cellCss;

        if (editable != undefined && (editable.always || this._editRecordId == record.get('id'))) {
            if (field.indexOf('|') != -1) { // Multiple Fields
                let fieldArr = field.split('|');
                let flexDiv = document.createElement('div');
                flexDiv.className = 'flex gap-x-1';
                for (let fieldEl of fieldArr) {
                    let { type, settings } = editable[fieldEl] || {};
                    let fieldDiv = document.createElement('div');
                    let dataField = new DataField({
                        dataset: this.dataset,
                        containerElement: fieldDiv,
                        edit: fieldEl,
                        format: 'cell',
                        type: type || 'text',
                        recordId: record.get('id'),
                        settings: settings,
                    });

                    flexDiv.append(fieldDiv);
                }
                td.append(flexDiv);
                return td;
            }

            let { type, settings } = editable;
            let fieldDiv = document.createElement('div');
            let dataField = new DataField({
                dataset: this.dataset,
                containerElement: fieldDiv,
                edit: field,
                format: 'cell',
                type: type || 'text',
                recordId: record.get('id'),
                settings: settings,
            });

            td.append(fieldDiv);
            return td;
        }

        if (selectable) {
            td.setAttribute('dataset-record-field', 'selectable');
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            td.append(checkbox);
            return td;
        }

        if (display instanceof Function) {
            let displayResult = display(td, record, this.dataset, this);
            if (displayResult != undefined) td.innerHTML = displayResult;
            return td;
        } else if (typeof(display) == 'string') td.innerHTML = display;
        if (display != undefined) return td;

        td.innerHTML = record.get(field, format);

        return td;
    }

    _select(recordId) {
        let selectedRows = this._bodyElement.querySelectorAll('.datagrid_selected');
        for (let selectedRow of selectedRows) selectedRow.classList.remove('datagrid_selected');

        let rowToSelect = this._bodyElement.querySelector(`tr[dataset-record-id="${recordId}"]`);
        if (rowToSelect == undefined) return;
        rowToSelect.classList.add('datagrid_selected');
    }

    _checkAll(isChecked) {
        let checkboxes = this.containerElement.querySelectorAll('td[dataset-record-field="selectable"] input[type="checkbox"]');
        for (let checkbox of checkboxes)
            checkbox.checked = isChecked;
    }
}
